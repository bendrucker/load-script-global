# load-script-global [![Build Status](https://travis-ci.org/bendrucker/load-script-global.svg?branch=master)](https://travis-ci.org/bendrucker/load-script-global)

> Load a global library via a script tag


## Install

```
$ npm install --save load-script-global
```


## Usage

```js
var load = require('load-script-global')

load({
  url: 'https://maps.googleapis.com/maps/api/js?key=k',
  global: 'google',
  jsonp: true
}, function (err, google) {
  //=> google.Maps...  
})
```

* Attempting to load once the library is already available will avoid creating a new `<script>` tag but still call the callback with the library
* Attemtping to load the library multiple times in a row will only create a single script tag and still calls each callback

## API

#### `load(options, callback)` -> `undefined`

##### options

*Required*  
Type: `object`

###### url

*Required*  
Type: `string`

The script URL.

###### global

*Required*  
Type: `string`

The name of the window global that the script will publish.

###### jsonp

Type: `boolean`

If `true`, listens for success via a JSONP callback instead of on `script.onload`.

##### callback

*Required*  
Type: `function`  
Arguments: `err, library`

A callback that will be called with a loading error or the library as published on the window once available.

## License

MIT © [Ben Drucker](http://bendrucker.me)
