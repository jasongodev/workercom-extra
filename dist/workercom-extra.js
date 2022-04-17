import { expose, wrap } from 'workercom'
export { createEndpoint, installTransfer, releaseProxy, windowEndpoint } from 'workercom'

function _inheritsLoose (subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype)
  subClass.prototype.constructor = subClass

  _setPrototypeOf(subClass, superClass)
}

function _getPrototypeOf (o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf (o) {
      return o.__proto__ || Object.getPrototypeOf(o)
    }
  return _getPrototypeOf(o)
}

function _setPrototypeOf (o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf (o, p) {
    o.__proto__ = p
    return o
  }

  return _setPrototypeOf(o, p)
}

function _isNativeReflectConstruct () {
  if (typeof Reflect === 'undefined' || !Reflect.construct) return false
  if (Reflect.construct.sham) return false
  if (typeof Proxy === 'function') return true

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}))
    return true
  } catch (e) {
    return false
  }
}

function _construct (Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct
  } else {
    _construct = function _construct (Parent, args, Class) {
      const a = [null]
      a.push.apply(a, args)
      const Constructor = Function.bind.apply(Parent, a)
      const instance = new Constructor()
      if (Class) _setPrototypeOf(instance, Class.prototype)
      return instance
    }
  }

  return _construct.apply(null, arguments)
}

function _isNativeFunction (fn) {
  return Function.toString.call(fn).indexOf('[native code]') !== -1
}

function _wrapNativeSuper (Class) {
  const _cache = typeof Map === 'function' ? new Map() : undefined

  _wrapNativeSuper = function _wrapNativeSuper (Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class

    if (typeof Class !== 'function') {
      throw new TypeError('Super expression must either be null or a function')
    }

    if (typeof _cache !== 'undefined') {
      if (_cache.has(Class)) return _cache.get(Class)

      _cache.set(Class, Wrapper)
    }

    function Wrapper () {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor)
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    })
    return _setPrototypeOf(Wrapper, Class)
  }

  return _wrapNativeSuper(Class)
}

let bundleURL

function getBundleURLCached () {
  if (!bundleURL) {
    bundleURL = getBundleURL()
  }

  return bundleURL
}

function getBundleURL () {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error()
  } catch (err) {
    const matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g)

    if (matches) {
      return getBaseURL(matches[0])
    }
  }

  return '/'
}

function getBaseURL (url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)?\/[^/]+(?:\?.*)?$/, '$1') + '/'
}

const isAbsoluteURL = function isAbsoluteURL (value) {
  return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value)
}

function createSourceBlobURL (code) {
  const blob = new Blob([code], {
    type: 'application/javascript'
  })
  return URL.createObjectURL(blob)
}

const WebWorker = /* #__PURE__ */(function (_Worker) {
  _inheritsLoose(WebWorker, _Worker)

  function WebWorker (url, options) {
    if (typeof url === 'string' && options && options._baseURL) {
      url = new URL(url, options._baseURL)
    } else if (typeof url === 'string' && !isAbsoluteURL(url) && getBundleURLCached().match(/^file:\/\//i)) {
      let _options$CORSWorkarou

      url = new URL(url, getBundleURLCached().replace(/\/[^/]+$/, '/'))

      if ((_options$CORSWorkarou = options == null ? void 0 : options.CORSWorkaround) != null ? _options$CORSWorkarou : true) {
        url = createSourceBlobURL('importScripts(' + JSON.stringify(url) + ');')
      }
    }

    if (typeof url === 'string' && isAbsoluteURL(url)) {
      let _options$CORSWorkarou2

      // Create source code blob loading JS file via `importScripts()`
      // to circumvent worker CORS restrictions
      if ((_options$CORSWorkarou2 = options == null ? void 0 : options.CORSWorkaround) != null ? _options$CORSWorkarou2 : true) {
        url = createSourceBlobURL('importScripts(' + JSON.stringify(url) + ');')
      }
    }

    return _Worker.call(this, url, options) || this
  }

  return WebWorker
}(/* #__PURE__ */_wrapNativeSuper(Worker)))

const __events = {}

function on (event, callback) {
  if (!__events[event]) {
    __events[event] = []
  }

  __events[event].push(callback)
}

function fire (event, data) {
  let _events$event

  if (data === void 0) {
    data = {}
  }

  (_events$event = __events[event]) == null
    ? void 0
    : _events$event.forEach(function (callback) {
      callback(data)
    })
}

function __expose (value, ep) {
  expose({
    exposed: value,
    on: on
  })
}

function __wrap (ep) {
  const wrappedWorker = wrap(ep)
  const proxyWorker = new Proxy(wrappedWorker, {
    apply: function apply (target, thisArg, argumentsList) {
      return target.exposed.apply(target, argumentsList)
    },
    get: function get (target, prop, receiver) {
      return prop === 'on' ? target.on : prop ? target.exposed[prop] : target.exposed
    }
  })
  return proxyWorker
}

export { WebWorker as Worker, __expose as expose, fire, __wrap as wrap }
// # sourceMappingURL=workercom-extra.js.map
