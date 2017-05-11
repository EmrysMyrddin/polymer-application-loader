
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
      let head = document.head || document.getElementsByTagName('head')[0];
      head.insertAdjacentHTML('beforeend', html);
    })
  });
}