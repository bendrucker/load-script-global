'use strict'

var load = require('load-script')
var window = require('global/window')
var extend = require('xtend')
var assert = require('assert-ok')
var dezalgo = require('dezalgo')
var Listeners = require('ear')
var setQuery = require('url-set-query')
var cuid = require('cuid')

module.exports = loadGlobal

var listeners = {}

function loadGlobal (options, callback) {
  assert(options, 'options required')
  assert(options.url, 'url required')
  assert(options.global, 'global required')
  assert(callback, 'callback required')

  options = extend(options)
  callback = dezalgo(callback)

  if (getGlobal(options)) {
    return callback(null, getGlobal(options))
  }

  callback = cache(options, callback)
  if (!callback) return

  if (options.jsonp) {
    var id = jsonpCallback(options, callback)
    options.url = setQuery(options.url, 'callback=' + id)
  }

  load(options.url, options, function (err) {
    if (err) return callback(err)
    if (!options.jsonp) callback(null, getGlobal(options))
  })
}

function cache (options, callback) {
  if (!get()) {
    set(Listeners())
    get().add(callback)
    return function onComplete (err, lib) {
      get()(err, lib)
      set(Listeners())
    }
  }

  get().add(callback)
  return undefined

  function get () {
    return listeners[options.global]
  }

  function set (value) {
    listeners[options.global] = value
  }
}

function getGlobal (options) {
  return window[options.global]
}

function jsonpCallback (options, callback) {
  var id = cuid()
  window[id] = function jsonpCallback () {
    callback(null, getGlobal(options))
    delete window[id]
  }
  return id
}
