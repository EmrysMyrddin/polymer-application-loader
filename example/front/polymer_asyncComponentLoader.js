
function loadComponents () {
  polymerAsyncLoader = new Polymer_AsyncComponentLoader('components', 'http://localhost:8080/componentsList');
  polymerAsyncLoader.load();
}

class Polymer_AsyncComponentLoader {
  /**
   * @param polymerElementId {String} Id of the HTML that will encapsulate the components
   * @param componentsListPath {String} Path of the components list
   */
  constructor (polymerElementId, componentsListPath) {
    this._polymerElementId = polymerElementId;
    this._componentsListPath = componentsListPath;
    this._components = [];
    this._idEltCount = 0;
  }

  /**
   * Load every components listed with the list at componentsListPath
   */
  load () {
    this._fetchComponentsList()
      .then(_ => this._importComponentTemplates())
      .then(_ => this._instanciateComponents());
  }

  /**
   * Fetch the components list
   * @returns {Promise}
   * @private
   */
  _fetchComponentsList () {
    return fetch(this._componentsListPath)
             .then(res => res.json())
             .then(components => this._components = components)
             .catch(err => console.log(err));
  }

  /**
   * Import all the components by adding a link in head element
   * @returns {Promise}
   * @private
   */
  _importComponentTemplates () {
    return new Promise((resolve, reject) => {
      this._components.forEach(component => {
        // Verify if files is an array or not
        if (!Array.isArray(component.files)) {
          component.files = [ component.files ];
        }

        component.files.forEach(file => {
          let html = '<link rel="import" href="http://localhost:8080/' + component.componentName + '/' + file + '" />';
          document.head.insertAdjacentHTML('beforeend', html);
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
        let elt = document.createElement(component.eltName);
        elt.id = this._getUID(component.componentName);
        for (let prop in component.props) {
          elt.setAttribute(prop, component.props[prop]);
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
