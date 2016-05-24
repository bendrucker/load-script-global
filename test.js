'use strict'

var test = require('tape')
var proxyquire = require('proxyquire')
var document = require('global/document')

global.document = document

test('success', function (t) {
  t.plan(3)

  var window = {}
  var load = proxyquire('./', {
    'global/window': window
  })

  load({url: 'theUrl', global: 'theGlobal'}, function (err, lib) {
    if (err) return t.end(err)
    t.ok(lib)
    t.equal(lib, window.theGlobal)
    script.parentNode.removeChild(script)
  })

  var script = document.getElementsByTagName('script')[0]
  t.equal(script.src, 'theUrl')
  window.theGlobal = {}
  script.onload()
})

test('jsonp', function (t) {
  t.plan(5)

  var window = {}
  var load = proxyquire('./', {
    'global/window': window,
    cuid: function () {
      return 'theCuid'
    }
  })

  var options = {
    url: 'theUrl?param=val',
    global: 'theGlobal',
    jsonp: true
  }

  load(options, function (err, lib) {
    if (err) return t.end(err)
    t.ok(lib)
    t.equal(lib, window.theGlobal)
    t.notOk(window.theCuid)
    script.parentNode.removeChild(script)
  })

  var script = document.getElementsByTagName('script')[0]
  t.equal(script.src, 'theUrl?param=val&callback=theCuid')

  window.theGlobal = {}
  script.onload()

  t.equal(typeof window.theCuid, 'function')
  window.theCuid()
})

test('errors', function (t) {
  t.plan(1)

  var window = {}
  var load = proxyquire('./', {
    'global/window': window
  })

  load({url: 'theUrl', global: 'theGlobal'}, function (err, lib) {
    t.ok(err instanceof Error)
    script.parentNode.removeChild(script)
  })

  var script = document.getElementsByTagName('script')[0]
  script.onerror()
})

test('global not found', function (t) {
  t.plan(2)

  var window = {}
  var load = proxyquire('./', {
    'global/window': window
  })

  load({url: 'theUrl', global: 'theGlobal'}, function (err, lib) {
    t.ok(err)
    t.equal(err.message, 'expected: `window.theGlobal`, actual: `undefined`')
    script.parentNode.removeChild(script)
  })

  var script = document.getElementsByTagName('script')[0]
  script.onload()
})

test('existing global', function (t) {
  t.plan(2)

  var window = {
    theGlobal: true
  }
  var load = proxyquire('./', {
    'global/window': window
  })

  load({url: 'theUrl', global: 'theGlobal'}, function (err, lib) {
    if (err) return t.end(err)
    t.equal(lib, true)
    t.equal(document.getElementsByTagName('script').length, 0)
  })
})

test('caching', function (t) {
  t.plan(3)

  var window = {}
  var load = proxyquire('./', {
    'global/window': window
  })

  load({url: 'theUrl', global: 'theGlobal'}, function (err, lib) {
    if (err) return t.end(err)
    t.equal(lib, true)
  })

  load({url: 'theUrl', global: 'theGlobal'}, function (err, lib) {
    if (err) return t.end(err)
    t.equal(lib, true)
  })

  t.equal(scripts().length, 1)
  window.theGlobal = true
  scripts()[0].onload()
  scripts()[0].parentNode.removeChild(scripts()[0])

  function scripts () {
    return document.getElementsByTagName('script')
  }
})
