# Load dynamic polymer components from anywhere

Here's a template example that show you how to dynamically load components with just a js file.


## How to use

### Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

```
$ cd example/front
$ bower install
$ polymer serve
```

### Start backend server

```
$ cd example/server
$ npm install 
$ node app.js
```

Once polymer and node are started, you can view the application at localhost:8081.

### Creating a new plugin component

To create a new component, you have to create a new folder in the plugins directory, then create your component.html file. To have it instanciated on the front, you have to change the json inside the server just like the example below.

Remember that your component can be integrated with other plugins, so you have to declare your component inside an self calling function like in the example.

### Structure of the components list

The json sent by the server for the components list should look like this :

```
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
}
```