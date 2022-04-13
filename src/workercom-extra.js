/* global self, Worker, Blob */
import { expose, wrap, createEndpoint, windowEndpoint, installTransfer, releaseProxy } from 'workercom'

// Source: <https://github.com/parcel-bundler/parcel/blob/master/packages/core/parcel-bundler/src/builtins/bundle-url.js>
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

const isAbsoluteURL = (value) => /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value)

function createSourceBlobURL (code) {
  const blob = new Blob(
    [code],
    { type: 'application/javascript' }
  )
  return URL.createObjectURL(blob)
}

class WebWorker extends Worker {
  constructor (url, options) {
    if (typeof url === 'string' && options && options._baseURL) {
      url = new URL(url, options._baseURL)
    } else if (typeof url === 'string' && !isAbsoluteURL(url) && getBundleURLCached().match(/^file:\/\//i)) {
      url = new URL(url, getBundleURLCached().replace(/\/[^/]+$/, '/'))
      if (options?.CORSWorkaround ?? true) {
        url = createSourceBlobURL(`importScripts(${JSON.stringify(url)});`)
      }
    }
    if (typeof url === 'string' && isAbsoluteURL(url)) {
      // Create source code blob loading JS file via `importScripts()`
      // to circumvent worker CORS restrictions
      if (options?.CORSWorkaround ?? true) {
        url = createSourceBlobURL(`importScripts(${JSON.stringify(url)});`)
      }
    }
    super(url, options)
  }
}

const __events = {}

function on (event, callback) {
  if (!__events[event]) {
    __events[event] = []
  }
  __events[event].push(callback)
}

function fire (event, data = {}) {
  __events[event]?.forEach(callback => {
    callback(data)
  })
}

function __expose (value, ep = self) {
  expose({ exposed: value, on })
}

function __wrap (ep) {
  const wrappedWorker = wrap(ep)
  const proxyWorker = new Proxy(wrappedWorker, {
    apply: function (target, thisArg, argumentsList) {
      return target.exposed(...argumentsList)
    },
    get: function (target, prop, receiver) {
      return prop === 'on' ? target.on : prop ? target.exposed[prop] : target.exposed
    }
  })
  return proxyWorker
}

const GLOBAL = global || self
GLOBAL.BigInt64Array = GLOBAL.BigInt64Array || class noTypedArray {}
GLOBAL.BigUint64Array = GLOBAL.BigUint64Array || class noTypedArray {}

export { __expose as expose, __wrap as wrap, fire, WebWorker as Worker, createEndpoint, windowEndpoint, installTransfer, releaseProxy }
