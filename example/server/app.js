"use strict";

let express = require('express');
let app = express();
let http = require('http').Server(app);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  next()
})

app.use(express.static('./public/'));
app.use(express.static('../components/'));
app.use(express.static('./node_modules/'));



app.get('/', function (req, res) {
  res.sendfile("public/index.html");
});

/**
 * Server itself
 * @type {http.Server}
 */
let server = app.listen(8080, function () {
  //print few information about the server
  let host = server.address().address;
  let port = server.address().port;
  console.log("Server running and listening @ " + host + ":" + port);
});

/** list of components to be loaded */
let componentsList = {
  "id": "averylonguuid1337",
  "name": "Dahsboard 1",
  "styles": "css/font.css",
  "description": "Some description",
  "rows": 20,
  "cols": 20,
  "stylesvar": {
    "primary-color": "#FFF",
    "secondary-color": "#F00",
    "background-color": "#000",
    "font-family": "Roboto"
  },
  "plugins": [
    {
      "name": "nested",
      "instanceId": "nestes#1",
      "frontend": {
        "eltName": "nested-item",
        "files": [
          "nested.html"
        ],
        "x": 1,
        "y": 9,
        "rows": 5,
        "cols": 2,
        "props": {
          "title": "Nested 1",
          "hello1": "Hello 1",
          "hello2": "Hello 2"
        }
      }
    },
    {
      "name": "nested",
      "instanceId": "nested#2",
      "frontend": {
        "eltName": "nested-item",
        "files": [
          "nested.html"
        ],
        "x": 17,
        "y": 9,
        "rows": 5,
        "cols": 2,
        "props": {
          "title": "Nested 2",
          "hello1": "Hello 3",
          "hello2": "Hello 4"
        }
      }
    },
    {
      "name": "objectprop",
      "instanceId": "objectprop#1",
      "frontend": {
        "eltName": "objectprop-item",
        "files": [
          "objectprop.html"
        ],
        "x": 3,
        "y": 16,
        "rows": 1,
        "cols": 14,
        "props": {
          "user": {
            "name": "Sehsyha",
            "url": "https://github.com/Sehsyha"
          }
        }
      }
    },
    {
      "name": "shared-styles",
      "instanceId": "shared-styles#1",
      "frontend": {
        "files": [
          "shared-styles.html"
        ]
      }
    },
    {
      "name": "font-awesome",
      "instanceId": "font-awesome#1",
      "frontend": {
        "files": [
          "font-awesome.html"
        ]
      }
    }
  ]
};

/**
 * Get a list of JSON for all registered components
 * @path /componentsList
 * @HTTPMethod GET
 * @returns {string}
 */
app.get("/componentsList", function (req, res) {
  res.send(componentsList);
});
