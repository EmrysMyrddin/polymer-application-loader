class PolymerApplicationLoader {
  /**
   * Load every components listed with the list at componentsListPath
   * Load general CSS
   * Then load general scripts
   * Then import componnent templates
   * Then instanciate components
   *
   * @param polymerElementId {String} Id of the HTML that will encapsulate the components
   * @param apiUrl {String} Url of the API where the components and the components list are located
   * @param componentsListPath {String} Path of the components list
   */
  load(polymerElementId, componentsListUrl, defaultComponentUrl = '') {
    this._polymerElementId = polymerElementId
    this._componentsListUrl = componentsListUrl
    this._defaultComponentUrl = defaultComponentUrl
    this._components = []
    this._styles = []
    this._idEltCount = 0
    this._templates = []
    this._grid = false
    this._rowsFactor = 0
    this._colsFactor = 0
    this._styleVars = {}

    // Launch components loading
    this._fetchComponentsList()
      .then(() => this._loadStyles())
      .then(() => this._addStyleVars())
      .then(() => this._loadScripts())
      .then(() => this._importComponentTemplates())
      .then(() => this._instanciateComponents())
  }

  /**
   * Fetch the components list
   * @returns {Promise}
   * @private
   */
  _fetchComponentsList() {
    return fetch(this._componentsListUrl)
      .then(res => res.json())
      .then(config => {
        if (config.rows && config.cols) {
          this._rowsFactor = 100 / config.rows
          this._colsFactor = 100 / config.cols
          this._grid = true
        }
        this._components = config.components || config.plugins
        this._styles = config.styles
        this._scripts = config.scripts
        this._styleVars = config.stylesvar || {}
      })
      .catch(err => console.log(err))
  }

  /**
   * Load every global styles
   * @private
   */
  _loadStyles() {
    this._styles = this._wrapInArray(this._styles)
    return Promise.all(this._styles.map(style => this._loadStyle(style)))
  }

  _loadStyle(href) {
    return new Promise((onload, onerror) => {
      const elt = document.createElement('link')
      Object.assign(elt, { rel: 'stylesheet', type: 'text/css', onload, onerror, href })
      document.head.appendChild(elt)
    })
  }

  /**
   * Add style variables into the body element
   */
  _addStyleVars() {
    for (var style in this._styleVars) {
      document.body.style.setProperty('--' + style, this._styleVars[style])
    }
  }

  /**
   * Load every (external) scripts such as libraries
   * @private
   */
  _loadScripts() {
    this._scripts = this._wrapInArray(this._scripts)
    const promises = this._scripts.map(script => this._loadScript(script))
    return Promise.all(promises)
  }

  /**
   * Create the promise to load the script
   * @param {String} src
   */
  _loadScript(src) {
    return new Promise((onload, onerror) => {
      const script = document.createElement('script')
      Object.assign(script, { async: true, onload, onerror, src })
      document.head.appendChild(script)
    })
  }

  /**
   * Import all the components by adding a link in head element
   * @returns {Promise}
   * @private
   */
  _importComponentTemplates() {
    const promises = this._components.map(component => this._importComponentTemplate(component))
    return Promise.all(promises)
  }

  _importComponentTemplate(component) {
    return new Promise((onload, onerror) => {
      const baseUrl = component.url || this._defaultComponentUrl
      const { eltName, instanceId } = component
      const href = `${baseUrl}/${eltName}/${instanceId}/`

      if (this._templates[eltName]) return onload()
      this._templates[eltName] = true

      const link = document.createElement('link')
      Object.assign(link, { rel: 'import', href, onload, onerror })
      document.head.appendChild(link)
    })
  }

  /**
   * Instanciate the different components and set their attributes
   * @returns {Promise}
   * @private
   */
  _instanciateComponents() {
    let insertElt = document.getElementById(this._polymerElementId)
    this._components.forEach(component => {
      const eltName = component.eltName
      if (!eltName) console.error('Element name is missing on component', component)

      const elt = document.createElement(eltName)
      elt.id = component.instanceId

      this._stringifyProps(component.frontend.props).forEach(([name, value]) =>
        elt.setAttribute(name, value),
      )

      if (component.backend && component.backend.ports) {
        elt.setAttribute('back', 'http://localhost' + component.backend.port)
      }

      if (component.slots) this._addSlots(elt, component.slots)

      const { x, y, cols, rows } = component.frontend
      if (x != null && y != null && rows && cols && this._grid) {
        Object.assign(elt.style, {
          display: 'block',
          position: 'absolute',
          left: x * this._colsFactor + '%',
          top: y * this._rowsFactor + '%',
          height: rows * this._rowsFactor + '%',
          width: cols * this._colsFactor + '%',
        })
      }

      insertElt.appendChild(elt)
    })
  }

  /**
   * Turns a map of props into a list of tuples (name, value) with a stringifyed value if necessary
   * @param {Object} props
   * @return {Array<[string, string]>} The list of tuples of props
   */
  _stringifyProps(props) {
    return Object.keys(props)
      .map(propName => {
        const value = props[propName]
        if (typeof value === 'boolean' && !value) return
        const stringValue = value instanceof Object ? JSON.stringify(value) : value
        return [propName, stringValue]
      })
      .filter(prop => prop)
  }

  /**
   * Add slots to a component before its inserted in the page
   * @param {HTMLElement} elt Create component element
   * @param {Array} slots Slots to add to the page
   */
  _addSlots(elt, slots) {
    if (!Array.isArray(slots)) {
      slots = [slots]
    }
    slots.forEach(slot => {
      let slotElt = document.createElement(slot.tag)
      slotElt.slot = slot.name

      if (slot.className) slotElt.className = slot.className
      if (slot.content) slotElt.innerHTML = slot.content

      elt.appendChild(slotElt)
    })
  }

  /**
   * Wraps if necessary an item into an array.
   * @param {Array | *} item The item to wrap or an array of item
   * @return {Array} An array with the item or the given array of tiems
   */
  _wrapInArray(item) {
    return item ? (Array.isArray(item) ? item : [item]) : []
  }
}
