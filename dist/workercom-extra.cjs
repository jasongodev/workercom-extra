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

/**
 *  base64.ts
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 *
 * @author Dan Kogai (https://github.com/dankogai)
 */
const _hasatob = typeof atob === 'function'
const _hasbtoa = typeof btoa === 'function'
const _hasBuffer = typeof Buffer === 'function'
typeof TextDecoder === 'function' ? new TextDecoder() : undefined
typeof TextEncoder === 'function' ? new TextEncoder() : undefined
const b64ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
const b64chs = Array.prototype.slice.call(b64ch)
const b64tab = ((a) => {
  const tab = {}
  a.forEach((c, i) => tab[c] = i)
  return tab
})(b64chs)
const b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/
const _fromCC = String.fromCharCode.bind(String)
typeof Uint8Array.from === 'function'
  ? Uint8Array.from.bind(Uint8Array)
  : (it, fn = (x) => x) => new Uint8Array(Array.prototype.slice.call(it, 0).map(fn))
const _tidyB64 = (s) => s.replace(/[^A-Za-z0-9\+\/]/g, '')
/**
 * polyfill version of `btoa`
 */
const btoaPolyfill = (bin) => {
  // console.log('polyfilled');
  let u32; let c0; let c1; let c2; let asc = ''
  const pad = bin.length % 3
  for (let i = 0; i < bin.length;) {
    if ((c0 = bin.charCodeAt(i++)) > 255 ||
            (c1 = bin.charCodeAt(i++)) > 255 ||
            (c2 = bin.charCodeAt(i++)) > 255) { throw new TypeError('invalid character found') }
    u32 = (c0 << 16) | (c1 << 8) | c2
    asc += b64chs[u32 >> 18 & 63] +
            b64chs[u32 >> 12 & 63] +
            b64chs[u32 >> 6 & 63] +
            b64chs[u32 & 63]
  }
  return pad ? asc.slice(0, pad - 3) + '==='.substring(pad) : asc
}
/**
 * does what `window.btoa` of web browsers do.
 * @param {String} bin binary string
 * @returns {string} Base64-encoded string
 */
const _btoa = _hasbtoa
  ? (bin) => btoa(bin)
  : _hasBuffer
    ? (bin) => Buffer.from(bin, 'binary').toString('base64')
    : btoaPolyfill
/**
 * polyfill version of `atob`
 */
const atobPolyfill = (asc) => {
  // console.log('polyfilled');
  asc = asc.replace(/\s+/g, '')
  if (!b64re.test(asc)) { throw new TypeError('malformed base64.') }
  asc += '=='.slice(2 - (asc.length & 3))
  let u24; let bin = ''; let r1; let r2
  for (let i = 0; i < asc.length;) {
    u24 = b64tab[asc.charAt(i++)] << 18 |
            b64tab[asc.charAt(i++)] << 12 |
            (r1 = b64tab[asc.charAt(i++)]) << 6 |
            (r2 = b64tab[asc.charAt(i++)])
    bin += r1 === 64
      ? _fromCC(u24 >> 16 & 255)
      : r2 === 64
        ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255)
        : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255)
  }
  return bin
}
/**
 * does what `window.atob` of web browsers do.
 * @param {String} asc Base64-encoded string
 * @returns {string} binary string
 */
const _atob = _hasatob
  ? (asc) => atob(_tidyB64(asc))
  : _hasBuffer
    ? (asc) => Buffer.from(asc, 'base64').toString('binary')
    : atobPolyfill

const createEndpoint = Symbol('workercom.endpoint')
const releaseProxy = Symbol('workercom.releaseProxy')
const transfused = 'workercom.transfused'
const throwError = Symbol('workercom.throwError')
let MessageType;
(function (MessageType) {
  MessageType.GET = 'get'
  MessageType.SET = 'set'
  MessageType.APPLY = 'apply'
  MessageType.CONSTRUCT = 'construct'
  MessageType.ENDPOINT = 'endpoint'
  MessageType.RELEASE = 'release'
})(MessageType || (MessageType = {}))
function generateUUID () {
  return new Array(4)
    .fill(0)
    .map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16))
    .join('-')
}
function requestResponseMessage (endpoint, msg, transfers = []) {
  return new Promise((resolve) => {
    const id = generateUUID()
    // * handler response from worker by id
    endpoint.addEventListener('message', function handler (evt) {
      if (evt.data.id === id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        endpoint.removeEventListener('message', handler)
        resolve(evt.data.return)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })
    if (endpoint.start) {
      endpoint.start()
    }
    // * send request to worker
    endpoint.postMessage({
      id,
      ...msg
    }, transfers)
  })
}
function wrap (endpoint) {
  return toProxy(endpoint)
}
function isMessagePort (port) {
  return port.constructor.name === 'MessagePort'
}
function toProxy (endpoint, path = [],
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  patch
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const proxy = new Proxy(() => { }, {
    get (_target, p) {
      const valInPatch = patch && path.slice(0, -1).reduce((obj, prop) => obj[prop], patch)
      if (patch && p in valInPatch) {
        return valInPatch
      }
      if (p === 'then') {
        if (path.length === 0) {
          return Promise.resolve(proxy)
        }
        return requestResponseMessage(endpoint, {
          type: MessageType.GET,
          path: path.map((item) => item.toString())
        }).then((ret) => argvMapToArguments([ret])[0])
      }
      return toProxy(endpoint, [...path, p])
    },
    set (_target, p, value) {
      const argvMapValue = argumentsToArgvMap([value])
      if (patch) {
        // eslint-disable-next-line functional/immutable-data
        patch[p] = value
        return true
      }
      void requestResponseMessage(endpoint, {
        type: MessageType.SET,
        path: [...path, p].map((item) => item.toString()),
        value: argvMapValue.value
      }, argvMapValue.transfers)
      return true // tấu hài đi vào lòng đất
    },
    apply (_target, _thisArg, argArray) {
      const name = path[path.length - 1] || ''
      if (name === createEndpoint) {
        return requestResponseMessage(endpoint, {
          type: MessageType.ENDPOINT
        }).then((ret) => argvMapToArguments([ret])[0])
      }
      if (name === releaseProxy) {
        return requestResponseMessage(endpoint, {
          type: MessageType.RELEASE
        }).then(() => {
          if (isMessagePort(endpoint)) {
            endpoint.close()
          }
        })
      }
      if (name === 'bind') {
        return toProxy(endpoint, path.slice(0, -1))
      }
      if (name === 'call') {
        argArray = argArray.slice(1)
      }
      if (name === 'apply') {
        argArray = argArray[1]
      }
      const mapArgArray = argumentsToArgvMap(argArray)
      return requestResponseMessage(endpoint, {
        type: MessageType.APPLY,
        arguments: mapArgArray.value,
        path: path.map((item) => typeof item === 'string' ? item : item.toString())
      }, mapArgArray.transfers).then((ret) => argvMapToArguments([ret])[0])
    },
    construct (_target, argArray) {
      const mapArgArray = argumentsToArgvMap(argArray)
      return requestResponseMessage(endpoint, {
        type: MessageType.CONSTRUCT,
        arguments: mapArgArray.value,
        path: path.map((item) => typeof item === 'string' ? item : item.toString())
      }, mapArgArray.transfers).then((ret) => argvMapToArguments([ret])[0])
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  })
  return proxy
}
function expose (obj,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  endpoint = self, sf) {
  endpoint.addEventListener('message', function callback (ev) {
    // eslint-disable-next-line functional/no-let
    let returnValue
    // eslint-disable-next-line functional/no-let
    let transfers = []
    try {
      const parent = ev.data.path
        .slice(0, -1)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .reduce((obj, prop) => obj[prop], obj)
      const rawValue = ev.data.path.reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (obj, prop) => obj[prop], obj)
      switch (ev.data.type) {
        case MessageType.GET:
          returnValue = rawValue
          break
        case MessageType.SET:
          // eslint-disable-next-line functional/immutable-data
          parent[ev.data.path[ev.data.path.length - 1]] = argvMapToArguments(ev.data.value)[0]
          returnValue = true
          break
        case MessageType.APPLY:
          returnValue = rawValue.call(sf ?? parent, ...argvMapToArguments(ev.data.arguments || []))
          break
        case MessageType.CONSTRUCT:
          returnValue = new rawValue(...argvMapToArguments(ev.data.arguments))
          break
        case MessageType.ENDPOINT:
          // eslint-disable-next-line no-case-declarations
          const { port1, port2 } = new MessageChannel()
          expose(obj, port1)
          returnValue = port2
          transfers = [port2]
          break
        case MessageType.RELEASE:
          break
        default:
          return void 0
      }
    } catch (err) {
      // eslint-disable-next-line functional/immutable-data
      err[throwError] = true
      returnValue = Promise.reject(err)
    }
    void Promise.resolve(returnValue)
      .catch((err) => {
        return err
      })
      .then((ret) => {
        const argvMapOfTheRet = argumentsToArgvMap([ret])
        endpoint.postMessage({
          id: ev.data.id,
          return: argvMapOfTheRet.value[0]
        }, [...transfers, ...argvMapOfTheRet.transfers])
        if (ev.data.type === MessageType.RELEASE) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          endpoint.removeEventListener('message', callback)
          if (isMessagePort(endpoint)) {
            endpoint.close()
          }
        }
      })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  })
  if (endpoint.start) {
    endpoint.start()
  }
}
const transfersInstalled = new Map()
function installTransfer (type, transfer) {
  transfersInstalled.set(type, transfer)
}
function keys (obj, fulltext = true) {
  if (Array.isArray(obj)) {
    return new Array(obj.length).fill(0).map((_v, i) => i + '')
  }
  if (fulltext) {
    const prototype = Object.getPrototypeOf(obj)
    const props = [
      ...new Set([
        ...Object.getOwnPropertyNames(obj),
        ...(Object.getPrototypeOf(prototype)
          ? Object.getOwnPropertyNames(prototype)
          : [])
      ].filter((p, i, arr) => p !== 'constructor' &&
                p !== '__proto__' && // not the constructor
                (i == 0 || p !== arr[i - 1])))
    ]
    return props
  }
  return Object.getOwnPropertyNames(obj).filter((p, i, arr) => p !== 'constructor' && // not the constructor
        (i == 0 || p !== arr[i - 1]))
}
function argumentsToArgvMap (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  argvs,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parent = self,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  weakCache = new WeakMap() // đây là trình quản lý cache để tránh lăp vô hạn object --- toàn bộ transfer đã tồn tại nếu dc cài đặt cache
) {
  // eslint-disable-next-line functional/prefer-readonly-type
  const argvMap = []
  // eslint-disable-next-line functional/prefer-readonly-type
  const transfers = []
  const { length } = argvs
  // eslint-disable-next-line functional/no-let
  let index = 0
  // eslint-disable-next-line functional/no-loop-statement
  whileMain: while (index < length) {
    const argv = argvs[index]
    if (weakCache?.has(argv)) {
      // eslint-disable-next-line functional/immutable-data
      argvMap[index] = weakCache.get(argv)
      index++
      continue
    }
    // eslint-disable-next-line functional/no-loop-statement
    for (const [transferName, transfer] of transfersInstalled.entries()) {
      if (transfer.canHandle(argv)) {
        const sr = transfer.serialize(argv, parent)
        const hydrated = {
          transfer: transferName,
          raw: sr[0],
          [transfused]: true
        }
        weakCache?.set(argv, hydrated)
        // eslint-disable-next-line functional/immutable-data
        transfers.push(...(sr[1] || []))
        // eslint-disable-next-line functional/immutable-data
        argvMap[index] = hydrated
        break whileMain
      }
    }
    if (argv && typeof argv === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newArgvMapForArgv = Array.isArray(argv) ? [] : {}
      weakCache?.set(argv, newArgvMapForArgv)
      keys(argv).forEach((key) => {
        if (key === '__proto__') {
          return // cuts
        }
        const mapArgv = argumentsToArgvMap([argv[key]], argv, weakCache)
        // eslint-disable-next-line functional/immutable-data
        newArgvMapForArgv[key] = mapArgv.value[0]
        // eslint-disable-next-line functional/immutable-data
        transfers.push(...mapArgv.transfers)
      })
      // eslint-disable-next-line functional/immutable-data
      argvMap[index] = newArgvMapForArgv
      // }
      index++
      continue
    }
    // eslint-disable-next-line functional/immutable-data
    argvMap[index] = argv
    index++
  }
  weakCache = null
  return {
    value: argvMap,
    transfers
  }
}
function argvMapToArguments (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  argvMaps,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  weakCache = new WeakMap() // đây là trình quản lý cache để tránh lăp vô hạn object
) {
  // eslint-disable-next-line functional/prefer-readonly-type
  const argvs = []
  const { length } = argvMaps
  // eslint-disable-next-line functional/no-let
  let index = 0
  // eslint-disable-next-line functional/no-loop-statement
  while (index < length) {
    const argvMap = argvMaps[index]
    if (weakCache?.has(argvMap)) {
      // eslint-disable-next-line functional/immutable-data
      argvs[index] = weakCache.get(argvMap)
      index++
      continue
    }
    if (argvMap?.[transfused]) {
      /// exists transfer ?
      if (transfersInstalled.has(argvMap.transfer)) {
        // deserialize
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, functional/immutable-data
        argvs[index] = transfersInstalled
          .get(argvMap.transfer)
          .deserialize(argvMap)
        index++
        continue
      }
    }
    if (argvMap && typeof argvMap === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newArgvForArgvMap = Array.isArray(argvMap) ? [] : {}
      weakCache?.set(argvMap, newArgvForArgvMap)
      keys(argvMap, false).forEach((key) => {
        if (key === '__proto__') {
          return // cuts
        }
        // eslint-disable-next-line functional/immutable-data
        newArgvForArgvMap[key] = argvMapToArguments([argvMap[key]], weakCache)[0]
      })
      // eslint-disable-next-line functional/immutable-data
      argvs[index] = newArgvForArgvMap
      index++
      continue
      // }
    }
    // eslint-disable-next-line functional/immutable-data
    argvs[index] = argvMap
    index++
  }
  weakCache = null
  return argvs
}
function windowEndpoint (w, context = self, targetOrigin = '*') {
  return {
    postMessage: (msg, transferables) => w.postMessage(msg, targetOrigin, transferables),
    addEventListener: context.addEventListener.bind(context),
    removeEventListener: context.removeEventListener.bind(context)
  }
}
/** * Install transfer default * **/
installTransfer('function', {
  canHandle: (value) => typeof value === 'function',
  serialize: (fn, parent) => {
    const { port1, port2 } = new MessageChannel()
    expose(fn, port1, parent)
    const { value, transfers } = argumentsToArgvMap([
      Object.assign(Object.create(fn), {
        prototype: undefined
      })
    ])
    return [
      {
        port: port2,
        property: value[0],
        toString: fn.toString()
      },
      [port2, ...transfers]
    ]
  },
  deserialize: ({ raw: { port, property, toString } }) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const noop = () => { }
    const proto = {
      toString () {
        return toString
      }
    }
    Object.getOwnPropertyNames(noop).forEach((prop) => {
      // fix : TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them
      switch (prop) {
        case 'caller':
        case 'calle':
          // eslint-disable-next-line functional/immutable-data
          proto[prop] = self
          break
        case 'arguments':
          // eslint-disable-next-line functional/immutable-data
          proto[prop] = []
          break
        case 'bind':
        case 'call':
        case 'apply':
          break
        default:
          if (typeof noop[prop] === 'function') {
            // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-explicit-any
            proto[prop] = noop[prop].bind(noop)
          } else {
            // eslint-disable-next-line functional/immutable-data
            proto[prop] = noop[prop]
          }
      }
    })
    return toProxy(port, [],
      // eslint-disable-next-line functional/immutable-data
      Object.assign(proto, argvMapToArguments([property])[0]))
  }
})
installTransfer('error', {
  canHandle: (value) => value instanceof Error || value?.[throwError],
  serialize: (value) => {
    // eslint-disable-next-line functional/no-let, @typescript-eslint/no-explicit-any
    let serialized
    if (value instanceof Error) {
      serialized = {
        isError: true,
        value: {
          message: value.message,
          name: value.name,
          stack: value.stack
        }
      }
      const props = keys(value)
      props.forEach((prop) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof value[prop] === 'function') {
          return /// skip
        }
        // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-explicit-any
        serialized.value[prop] = value[prop]
      })
    } else {
      serialized = { isError: false, value }
    }
    return [serialized, []]
  },
  deserialize: ({ raw: serialized }) => {
    if (serialized.isError) {
      // eslint-disable-next-line functional/no-throw-statement
      throw Object.assign(new Error(serialized.value.message), serialized.value)
    }
    // eslint-disable-next-line functional/no-throw-statement
    throw serialized.value
  }
})
function _arrayBufferToBase64 (buffer) {
  // eslint-disable-next-line functional/no-let
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  // eslint-disable-next-line functional/no-let
  let i = 0
  // eslint-disable-next-line functional/no-loop-statement
  while (i < len) {
    binary += String.fromCharCode(bytes[i++])
  }
  return _btoa(binary)
}
function _base64ToArrayBuffer (base64) {
  const binary_string = _atob(base64)
  const len = binary_string.length
  const bytes = new Uint8Array(len)
  // eslint-disable-next-line functional/no-let
  let i = 0
  // eslint-disable-next-line functional/no-loop-statement
  while (i < len) {
    // eslint-disable-next-line functional/immutable-data
    bytes[i] = binary_string.charCodeAt(i++)
  }
  return bytes.buffer
}
const TypedArrayConstructors = [
  Int8Array,
  Uint8Array,
  Uint8ClampedArray,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  BigInt64Array,
  BigUint64Array,
  Float64Array
]
function getNameTypedArrayConstructorUsed (typed) {
  return TypedArrayConstructors.find((typedArrayItem) => typed instanceof typedArrayItem)?.name
}
installTransfer('arraybuffer', {
  canHandle: (value) => value instanceof ArrayBuffer,
  serialize: (value) => [_arrayBufferToBase64(value), []],
  deserialize: ({ raw }) => _base64ToArrayBuffer(raw)
})
installTransfer('typedarray', {
  canHandle: (value) => !!getNameTypedArrayConstructorUsed(value),
  serialize: (value) => [
    {
      typedArrayName: getNameTypedArrayConstructorUsed(value),
      base64: _arrayBufferToBase64(value.buffer)
    },
    []
  ],
  deserialize: ({ raw }) => {
    const typedArrayItem = TypedArrayConstructors.find((typedArrayItem) => typedArrayItem.name === raw.typedArrayName)
    return new typedArrayItem(_base64ToArrayBuffer(raw.base64))
  }
})

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

exports.Worker = WebWorker
exports.createEndpoint = createEndpoint
exports.expose = __expose
exports.fire = fire
exports.installTransfer = installTransfer
exports.releaseProxy = releaseProxy
exports.windowEndpoint = windowEndpoint
exports.wrap = __wrap
// # sourceMappingURL=workercom-extra.cjs.map
