
function loadPlugins () {
  polymerAsyncLoader = new Polymer_AsyncComponentLoader('components', 'http://localhost:8080/pluginsList');
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
    this._plugins = [];
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
             .then(plugins => this._plugins = plugins)
             .catch(err => console.log(err));
  }

  /**
   * Import all the components by adding a link in head element
   * @returns {Promise}
   * @private
   */
  _importComponentTemplates () {
    return new Promise((resolve, reject) => {
      this._plugins.forEach(plugin => {
        // Verify if files is an array or not
        if (!Array.isArray(plugin.files)) {
          plugin.files = [ plugin.files ];
        }

        plugin.files.forEach(file => {
          let html = '<link rel="import" href="http://localhost:8080/' + plugin.pluginName + '/' + file + '" />';
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
      this._plugins.forEach(plugin => {
        let elt = document.createElement(plugin.eltName);
        elt.id = this._getUID(plugin.pluginName);
        for (let prop in plugin.props) {
          elt.setAttribute(prop, plugin.props[prop]);
        }
        insertElt.appendChild(elt);
      })
      resolve();
    })
  }

	/**
	 * Generate a unique ID for the plugin with the name passed as parameter
	 * @param pluginName {String}
	 * @returns {string} an unique ID
	 * @private
	 */
  _getUID(pluginName) {
    this._idEltCount++;

    let r = Math.random().toString(32).substr(4, 24);
    return pluginName + '_' + r + '_' + this._idEltCount;
  }

}
