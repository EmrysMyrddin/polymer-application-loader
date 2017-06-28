module.exports = {
  "styles": "css/font.css",
  "scripts": "bower_components/lodash/lodash.js",
  "styleVars": { "primary-color": "#F00" , "font": "Roboto", "weight": 100 },
  "rows": 20,
  "cols": 20,
  "plugins": [
    {
      "componentName": "nested",
      "eltName": "nested-item",
      "files": "nested.html",
      "x": 1,
      "y": 9,
      "rows": 8,
      "cols": 2,
      "propValues": {
        "title": "Nested 1",
        "hello1": "Hello 1",
        "hello2": "Hello 2"
      },
      "slots": [
        {
          "name": "title",
          "tag": "h1",
          "content": "Hello <span class=\"chartreuse\">World</span>"
        },
        {
          "name": "icon",
          "tag": "i",
          "className": "fa fa-github"
        },
        {
          "name": "icon",
          "tag": "i",
          "className": "fa fa-github"
        }
      ]
    },
    {
      "componentName": "nested",
      "eltName": "nested-item",
      "files": "nested.html",
      "x": 17,
      "y": 9,
      "rows": 6,
      "cols": 2,
      "propValues": {
        "title": "Nested 2",
        "hello1": "Hello 3",
        "hello2": "Hello 4"
      }
    },
    {
      "componentName": "objectprop",
      "eltName": "objectprop-item",
      "files": "objectprop.html",
      "x": 3,
      "y": 16,
      "rows": 1,
      "cols": 14,
      "propValues": {
        "user": {
          "name": "Sehsyha",
          "url": "https://github.com/Sehsyha"
        }
      }
    },
    {
      "componentName": "shared-styles",
      "files": "shared-styles.html"
    },
    {
      "componentName": "font-awesome",
      "files": "font-awesome.html"
    },
    {
      "componentName": "lodash-example",
      "eltName": "lodash-item",
      "files": "lodash-example.html"
    },
    {
      "url": "https://raw.githubusercontent.com/Zenika/marcel-plugin-datetime/master",
      "eltName": "datetime-item",
      "files": [
        "datetime.html"
      ]
    }
  ]
};