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
  static load (polymerElementId, componentsListUrl, defaultComponentUrl = '') {
    this._polymerElementId = polymerElementId;
    this._componentsListUrl = componentsListUrl;
    this._defaultComponentUrl = defaultComponentUrl;
    this._components = [];
    this._styles = [];
    this._idEltCount = 0;
    this._templates = [];
    this._grid = false;
    this._rowsFactor = 0;
    this._colsFactor = 0;
    this._styleVars = {};

    // Launch components loading
    this._fetchComponentsList()
      .then(() => this._loadStyles())
      .then(() => this._addStyleVars())
      .then(() => this._loadScripts())
      .then(() => this._importComponentTemplates())
      .then(() => this._instanciateComponents());
  }

  /**
   * Fetch the components list
   * @returns {Promise}
   * @private
   */
  static _fetchComponentsList () {
    return fetch(this._componentsListUrl)
             .then(res => res.json())
             .then(config => {
               if (config.rows && config.cols) {
                 this._rowsFactor = 100 / config.rows;
                 this._colsFactor = 100 / config.cols;
                 this._grid = true;
               }
               this._components = config.components || config.plugins;
               this._styles = config.styles;
               this._scripts = config.scripts;
               this._styleVars = config.stylesvar || {};
             })
             .catch(err => console.log(err));
  }

  /**
   * Load every global styles
   * @private
   */
  static _loadStyles () {
    if (this._styles === undefined) {
      return;
    }
    // Verify if files are in an array or not
    if (!Array.isArray(this._styles)) {
      this._styles = [this._styles];
    }
    this._styles.forEach(style => {
      const elt = document.createElement('link');
      elt.rel = 'stylesheet';
      elt.type = 'text/css';
      elt.href = style;
      document.head.appendChild(elt);
    })
  }

  /**
   * Add style variables into the body element
   */
  static _addStyleVars () {
    for(var style in this._styleVars) {
      document.body.style.setProperty('--' + style, this._styleVars[style])
    }
  }

  /**
   * Load every (external) scripts such as libraries
   * @private
   */
  static _loadScripts () {
    return new Promise((resolve, reject) => {
      if (this._scripts === undefined) {
        return resolve();
      }
      // Verify if files are in an array or not
      if (!Array.isArray(this._scripts)) {
        this._scripts = [this._scripts];
      }

      const fns = [];
      this._scripts.forEach((script) => fns.push(() => this._loadScript(script)));
      
      // Resolve promise after every script loaded
      fns.push(() => resolve())
      fns.reduce((p, fn) => p.then(() => fn()), Promise.resolve())
    })
  }

  /**
   * Create the promise to load the script
   * @param {String} url
   */
  static _loadScript (url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');

      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      script.src = url;

      document.head.appendChild(script);
    })
  }

  /**
   * Import all the components by adding a link in head element
   * @returns {Promise}
   * @private
   */
  static _importComponentTemplates () {
    return new Promise((resolve, reject) => {
      this._components.forEach(component => {
        // Verify if files are in an array or not
        if (!Array.isArray(component.files)) {
          component.files = [ component.files ];
        }

        component.name = component.name || '.';

        component.frontend.files.forEach(file => {
          const componentUrl = component.url || this._defaultComponentUrl;
          const url = componentUrl + '/' + component.name + '/' + file;
          if (this._templates[url] !== undefined) {
            return resolve()
          }
          this._templates[url] = 1;
          const link = document.createElement('link');
          link.rel = 'import';
          link.href = url;
          document.head.appendChild(link);
        });
      });
      resolve();
    })
  }

  /**
   * Instanciate the different components and set their attributes
   * @returns {Promise}
   * @private
   */
  static _instanciateComponents () {
    return new Promise((resolve, reject) => {
      let insertElt = document.getElementById(this._polymerElementId);
      this._components.forEach(component => {
        const eltName = component.frontend.eltName;
        // Verify if the component has an eltName
        if (eltName === undefined) {
          return reject();
        }

        const propValues = component.frontend.props;
        let elt = document.createElement(eltName);
        elt.id = component.instanceId;
        for (let propName in propValues) {
          if (propValues[propName] instanceof Object) {
            elt.setAttribute(propName, JSON.stringify(propValues[propName]));
          }else {
            elt.setAttribute(propName, propValues[propName]);
          }
        }
        
        if (component.backend !== undefined && component.backend.ports !== undefined) {
          const back = component.backend.ports.map(port => 'http://localhost:' + port);
          elt.setAttribute('back', JSON.stringify(back))
        }

        if (component.slots != undefined) {
          this._addSlots(elt, component.slots)
        }

        const x = component.frontend.x;
        const y = component.frontend.y;
        const cols = component.frontend.cols;
        const rows = component.frontend.rows;

        if (x !== undefined && y !== undefined && rows !== undefined && cols !== undefined && this._grid) {
          elt.style.display = 'block';
          elt.style.position = 'absolute';
          elt.style.left = x * this._colsFactor + '%';
          elt.style.top = y * this._rowsFactor + '%';
          elt.style.height = rows * this._rowsFactor + '%';
          elt.style.width = cols * this._colsFactor + '%';
        }
        insertElt.appendChild(elt);
      })
      resolve();
    })
  }

  /**
   * Add slots to a component before its inserted in the page
   * @param {HTMLElement} elt Create component element
   * @param {Array} slots Slots to add to the page
   */
  static _addSlots (elt, slots) {
    if (!Array.isArray(slots)) {
      slots = [slots];
    }
    slots.forEach((slot) => {
      let slotElt = document.createElement(slot.tag);
      slotElt.slot = slot.name;
      if (slot.className !== undefined) {
        slotElt.className = slot.className;
      }
      if (slot.content !== undefined) {
        slotElt.innerHTML = slot.content;
      }
      elt.appendChild(slotElt)
    });
  }

	/**
	 * Generate a unique ID for the component with the name passed as parameter
	 * @param componentName {String}
	 * @returns {string} an unique ID
	 * @private
	 */
  static _getUID(componentName) {
    this._idEltCount++;

    let r = Math.random().toString(32).substr(4, 24);
    return componentName + '_' + r + '_' + this._idEltCount;
  }

}
