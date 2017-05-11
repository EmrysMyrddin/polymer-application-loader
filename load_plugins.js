
function loadPlugins () {
  fetch('http://localhost:8080/pluginsList')
    .then(res => res.json())
    .then(importPlugins)
}

function importPlugins (pluginsList) {
  pluginsList.forEach(plugin => {
    if (!Array.isArray(plugin.files)) {
      plugin.files = [plugin.files];
    }
    plugin.files.forEach(file => {
      let html = '<link rel="import" href="http://localhost:8080/' + plugin.pluginName + '/' + file + '" />';
      document.head.insertAdjacentHTML('beforeend', html);
    })
    let elt = document.createElement(plugin.eltName);
    for (let prop in plugin.props) {
      elt.setAttribute(prop, plugin.props[prop]);
    }
    document.body.appendChild(elt);
  });
}
