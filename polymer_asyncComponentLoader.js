
function loadComponents () {
  polymerAsyncLoader = new Polymer_AsyncComponentLoader('components', 'http://localhost:8080');
  polymerAsyncLoader.load();
}

class Polymer_AsyncComponentLoader {
  /**
   * @param polymerElementId {String} Id of the HTML that will encapsulate the components
   * @param apiUrl {String} Url of the API where the components and the components list are located
   * @param componentsListPath {String} Path of the components list
   */
  constructor (polymerElementId, apiUrl, componentsListPath = '/componentsList') {
    this._polymerElementId = polymerElementId;
    this._apiUrl = apiUrl;
    this._componentsListPath = this._apiUrl + componentsListPath;
    this._components = [];
    this._styles = [];
    this._idEltCount = 0;
    this._templates = [];
  }

  /**
   * Load every components listed with the list at componentsListPath
   */
  load () {
    this._fetchComponentsList()
      .then(() => this._loadStyles())
      .then(() => this._loadScripts())
      .then(() => this._importComponentTemplates())
      .then(() => this._instanciateComponents());
  }

  /**
   * Fetch the components list
   * @returns {Promise}
   * @private
   */
  _fetchComponentsList () {
    return fetch(this._componentsListPath)
             .then(res => res.json())
             .then(config => {
               this._components = config.components;
               this._styles = config.styles;
               this._scripts = config.scripts;
             })
             .catch(err => console.log(err));
  }

  /**
   * Load every global styles
   * @private
   */
  _loadStyles () {
    // Verify if files are in an array or not
    if (!Array.isArray(this._styles)) {
      this._styles = [this._styles];
    }
    this._styles.forEach(style => {
      const elt = document.createElement('link');
      elt.rel = 'stylesheet';
      elt.type = 'text/css';
      elt.href = this._apiUrl + '/' + style;
      document.head.appendChild(elt);
    })
  }

  /**
   * Load every (external) scripts
   * @private
   */
  _loadScripts () {
    // Verify if files are in an array or not
    if (!Array.isArray(this._scripts)) {
      this._scripts = [this._scripts];
    }
    this._scripts.forEach(script => {
      const elt = document.createElement('script');
      elt.src = this._apiUrl + '/' + script
      document.head.appendChild(elt);
    });
  }

  /**
   * Import all the components by adding a link in head element
   * @returns {Promise}
   * @private
   */
  _importComponentTemplates () {
    return new Promise((resolve, reject) => {
      this._components.forEach(component => {
        // Verify if files are in an array or not
        if (!Array.isArray(component.files)) {
          component.files = [ component.files ];
        }

        component.files.forEach(file => {
          let url = this._apiUrl + '/' + component.componentName + '/' + file;
          if (this._templates[url] !== undefined) {
            return resolve()
          }
          this._templates[url] = 1;
          let link = document.createElement('link');
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
  _instanciateComponents () {
    return new Promise((resolve, reject) => {
      let insertElt = document.getElementById(this._polymerElementId);
      this._components.forEach(component => {
        // Verify if the component has an eltName
        if (component.eltName === undefined) {
          return;
        }

        let elt = document.createElement(component.eltName);
        elt.id = this._getUID(component.componentName);
        for (let propName in component.propValues) {
          if (component.propValues[propName] instanceof Object) {
            elt.setAttribute(propName, JSON.stringify(component.propValues[propName]));
          }else {
            elt.setAttribute(propName, component.propValues[propName]);
          }
        }
        insertElt.appendChild(elt);
      })
      resolve();
    })
  }

	/**
	 * Generate a unique ID for the component with the name passed as parameter
	 * @param componentName {String}
	 * @returns {string} an unique ID
	 * @private
	 */
  _getUID(componentName) {
    this._idEltCount++;

    let r = Math.random().toString(32).substr(4, 24);
    return componentName + '_' + r + '_' + this._idEltCount;
  }

}
