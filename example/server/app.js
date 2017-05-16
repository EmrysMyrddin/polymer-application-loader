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
app.use(express.static('./components/'));
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
let componentsList = [
    {
        "componentName": "nested",
        "eltName": "nested-item",
        "files": "nested.html",
        "propValues": {
            "title": "Nested 1",
            "hello1": "Hello 1",
            "hello2": "Hello 2"
        }
    },
    {
        "componentName": "nested",
        "eltName": "nested-item",
        "files": "nested.html",
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
        "propValues": {
            "user": {
                "first_name": "Valentin",
                "last_name": "STERN"
            }
        }
	},
    {
        "componentName": "shared-styles",
        "files": "shared-styles.html"
    }
];

/**
 * Get a list of JSON for all registered components
 * @path /componentsList
 * @HTTPMethod GET
 * @returns {string}
 */
app.get("/componentsList", function (req, res) {
    res.send(componentsList);
});
