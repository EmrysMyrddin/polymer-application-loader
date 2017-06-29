# Load dynamic polymer components from anywhere

Script to load an entire application at runtime. 

## How to use

### Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

```
$ cd example/front
$ bower install
$ polymer serve
```

### Start backend server

```shell
cd example/server
npm install
node app.js
```

Once polymer and node are started, you can view the application at localhost:8081.

## Creating a new plugin component

To create a new component, you have to create a new folder in the plugins directory, then create your component.html file. To have it instanciated on the front, you have to change the json inside the server just like the example below.

Remember that your component can be integrated with other plugins, so you have to declare your component inside an self calling function like in the example.

## Structure of the components list

The json sent by the server for the components list should look like this :

```json
{
  "id": "averylonguuid1337",
  "name": "Dahsboard 1",
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
      "instanceId": "plugin#guuid",
      "name": "DevFest Lille",
      "frontend": {
        "files": [
          "devfest.html"
        ],
        "eltName": "devfest",
        "x": 0,
        "y": 0,
        "cols": 3,
        "rows": 3,
        "props": {
          "prop1": "value 1",
          "prop2": "value 2"
        }
      },
      "backend": {
        "ports":[8082],
        "props": {
          "googleAPIKey":"yyy",
          "aaa":"bbb"
        }
      }
    }
  ]
}
```