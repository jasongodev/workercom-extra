var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/workercom-extra.js
var workercom_extra_exports = {};
__export(workercom_extra_exports, {
  Worker: () => WebWorker,
  createEndpoint: () => createEndpoint,
  expose: () => __expose,
  fire: () => fire,
  installTransfer: () => installTransfer,
  releaseProxy: () => releaseProxy,
  windowEndpoint: () => windowEndpoint,
  wrap: () => __wrap
});
module.exports = __toCommonJS(workercom_extra_exports);

// node_modules/js-base64/base64.mjs
var _hasatob = typeof atob === "function";
var _hasbtoa = typeof btoa === "function";
var _hasBuffer = typeof Buffer === "function";
var _TD = typeof TextDecoder === "function" ? new TextDecoder() : void 0;
var _TE = typeof TextEncoder === "function" ? new TextEncoder() : void 0;
var b64ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var b64chs = Array.prototype.slice.call(b64ch);
var b64tab = ((a) => {
  let tab = {};
  a.forEach((c, i) => tab[c] = i);
  return tab;
})(b64chs);
var b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
var _fromCC = String.fromCharCode.bind(String);
var _U8Afrom = typeof Uint8Array.from === "function" ? Uint8Array.from.bind(Uint8Array) : (it, fn = (x) => x) => new Uint8Array(Array.prototype.slice.call(it, 0).map(fn));
var _tidyB64 = (s) => s.replace(/[^A-Za-z0-9\+\/]/g, "");
var btoaPolyfill = (bin) => {
  let u32, c0, c1, c2, asc = "";
  const pad = bin.length % 3;
  for (let i = 0; i < bin.length; ) {
    if ((c0 = bin.charCodeAt(i++)) > 255 || (c1 = bin.charCodeAt(i++)) > 255 || (c2 = bin.charCodeAt(i++)) > 255)
      throw new TypeError("invalid character found");
    u32 = c0 << 16 | c1 << 8 | c2;
    asc += b64chs[u32 >> 18 & 63] + b64chs[u32 >> 12 & 63] + b64chs[u32 >> 6 & 63] + b64chs[u32 & 63];
  }
  return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
};
var _btoa = _hasbtoa ? (bin) => btoa(bin) : _hasBuffer ? (bin) => Buffer.from(bin, "binary").toString("base64") : btoaPolyfill;
var atobPolyfill = (asc) => {
  asc = asc.replace(/\s+/g, "");
  if (!b64re.test(asc))
    throw new TypeError("malformed base64.");
  asc += "==".slice(2 - (asc.length & 3));
  let u24, bin = "", r1, r2;
  for (let i = 0; i < asc.length; ) {
    u24 = b64tab[asc.charAt(i++)] << 18 | b64tab[asc.charAt(i++)] << 12 | (r1 = b64tab[asc.charAt(i++)]) << 6 | (r2 = b64tab[asc.charAt(i++)]);
    bin += r1 === 64 ? _fromCC(u24 >> 16 & 255) : r2 === 64 ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255) : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255);
  }
  return bin;
};
var _atob = _hasatob ? (asc) => atob(_tidyB64(asc)) : _hasBuffer ? (asc) => Buffer.from(asc, "base64").toString("binary") : atobPolyfill;

// node_modules/workercom/build/module/index.js
var createEndpoint = Symbol("workercom.endpoint");
var releaseProxy = Symbol("workercom.releaseProxy");
var transfused = "workercom.transfused";
var throwError = Symbol("workercom.throwError");
var MessageType;
(function(MessageType2) {
  MessageType2["GET"] = "get";
  MessageType2["SET"] = "set";
  MessageType2["APPLY"] = "apply";
  MessageType2["CONSTRUCT"] = "construct";
  MessageType2["ENDPOINT"] = "endpoint";
  MessageType2["RELEASE"] = "release";
})(MessageType || (MessageType = {}));
function generateUUID() {
  return new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
}
function requestResponseMessage(endpoint, msg, transfers = []) {
  return new Promise((resolve) => {
    const id = generateUUID();
    endpoint.addEventListener("message", function handler(evt) {
      if (evt.data.id === id) {
        endpoint.removeEventListener("message", handler);
        resolve(evt.data.return);
      }
    });
    if (endpoint.start) {
      endpoint.start();
    }
    endpoint.postMessage(__spreadValues({
      id
    }, msg), transfers);
  });
}
function wrap(endpoint) {
  return toProxy(endpoint);
}
function isMessagePort(port) {
  return port.constructor.name === "MessagePort";
}
function toProxy(endpoint, path = [], patch) {
  const proxy = new Proxy(() => {
  }, {
    get(_target, p) {
      const valInPatch = patch && path.slice(0, -1).reduce((obj, prop) => obj[prop], patch);
      if (patch && p in valInPatch) {
        return valInPatch;
      }
      if (p === "then") {
        if (path.length === 0) {
          return Promise.resolve(proxy);
        }
        return requestResponseMessage(endpoint, {
          type: MessageType.GET,
          path: path.map((item) => item.toString())
        }).then((ret) => argvMapToArguments([ret])[0]);
      }
      return toProxy(endpoint, [...path, p]);
    },
    set(_target, p, value) {
      const argvMapValue = argumentsToArgvMap([value]);
      if (patch) {
        patch[p] = value;
        return true;
      }
      void requestResponseMessage(endpoint, {
        type: MessageType.SET,
        path: [...path, p].map((item) => item.toString()),
        value: argvMapValue.value
      }, argvMapValue.transfers);
      return true;
    },
    apply(_target, _thisArg, argArray) {
      const name = path[path.length - 1] || "";
      if (name === createEndpoint) {
        return requestResponseMessage(endpoint, {
          type: MessageType.ENDPOINT
        }).then((ret) => argvMapToArguments([ret])[0]);
      }
      if (name === releaseProxy) {
        return requestResponseMessage(endpoint, {
          type: MessageType.RELEASE
        }).then(() => {
          if (isMessagePort(endpoint)) {
            endpoint.close();
          }
        });
      }
      if (name === "bind") {
        return toProxy(endpoint, path.slice(0, -1));
      }
      if (name === "call") {
        argArray = argArray.slice(1);
      }
      if (name === "apply") {
        argArray = argArray[1];
      }
      const mapArgArray = argumentsToArgvMap(argArray);
      return requestResponseMessage(endpoint, {
        type: MessageType.APPLY,
        arguments: mapArgArray.value,
        path: path.map((item) => typeof item === "string" ? item : item.toString())
      }, mapArgArray.transfers).then((ret) => argvMapToArguments([ret])[0]);
    },
    construct(_target, argArray) {
      const mapArgArray = argumentsToArgvMap(argArray);
      return requestResponseMessage(endpoint, {
        type: MessageType.CONSTRUCT,
        arguments: mapArgArray.value,
        path: path.map((item) => typeof item === "string" ? item : item.toString())
      }, mapArgArray.transfers).then((ret) => argvMapToArguments([ret])[0]);
    }
  });
  return proxy;
}
function expose(obj, endpoint = self, sf) {
  endpoint.addEventListener("message", function callback(ev) {
    let returnValue;
    let transfers = [];
    try {
      const parent = ev.data.path.slice(0, -1).reduce((obj2, prop) => obj2[prop], obj);
      const rawValue = ev.data.path.reduce((obj2, prop) => obj2[prop], obj);
      switch (ev.data.type) {
        case MessageType.GET:
          returnValue = rawValue;
          break;
        case MessageType.SET:
          parent[ev.data.path[ev.data.path.length - 1]] = argvMapToArguments(ev.data.value)[0];
          returnValue = true;
          break;
        case MessageType.APPLY:
          returnValue = rawValue.call(sf != null ? sf : parent, ...argvMapToArguments(ev.data.arguments || []));
          break;
        case MessageType.CONSTRUCT:
          returnValue = new rawValue(...argvMapToArguments(ev.data.arguments));
          break;
        case MessageType.ENDPOINT:
          const { port1, port2 } = new MessageChannel();
          expose(obj, port1);
          returnValue = port2;
          transfers = [port2];
          break;
        case MessageType.RELEASE:
          break;
        default:
          return void 0;
      }
    } catch (err) {
      err[throwError] = true;
      returnValue = Promise.reject(err);
    }
    void Promise.resolve(returnValue).catch((err) => {
      return err;
    }).then((ret) => {
      const argvMapOfTheRet = argumentsToArgvMap([ret]);
      endpoint.postMessage({
        id: ev.data.id,
        return: argvMapOfTheRet.value[0]
      }, [...transfers, ...argvMapOfTheRet.transfers]);
      if (ev.data.type === MessageType.RELEASE) {
        endpoint.removeEventListener("message", callback);
        if (isMessagePort(endpoint)) {
          endpoint.close();
        }
      }
    });
  });
  if (endpoint.start) {
    endpoint.start();
  }
}
var transfersInstalled = /* @__PURE__ */ new Map();
function installTransfer(type, transfer) {
  transfersInstalled.set(type, transfer);
}
function keys(obj, fulltext = true) {
  if (Array.isArray(obj)) {
    return new Array(obj.length).fill(0).map((_v, i) => i + "");
  }
  if (fulltext) {
    const prototype = Object.getPrototypeOf(obj);
    const props = [
      ...new Set([
        ...Object.getOwnPropertyNames(obj),
        ...Object.getPrototypeOf(prototype) ? Object.getOwnPropertyNames(prototype) : []
      ].filter((p, i, arr) => p !== "constructor" && p !== "__proto__" && (i == 0 || p !== arr[i - 1])))
    ];
    return props;
  }
  return Object.getOwnPropertyNames(obj).filter((p, i, arr) => p !== "constructor" && (i == 0 || p !== arr[i - 1]));
}
function argumentsToArgvMap(argvs, parent = self, weakCache = /* @__PURE__ */ new WeakMap()) {
  const argvMap = [];
  const transfers = [];
  const { length } = argvs;
  let index = 0;
  whileMain:
    while (index < length) {
      const argv = argvs[index];
      if (weakCache == null ? void 0 : weakCache.has(argv)) {
        argvMap[index] = weakCache.get(argv);
        index++;
        continue;
      }
      for (const [transferName, transfer] of transfersInstalled.entries()) {
        if (transfer.canHandle(argv)) {
          const sr = transfer.serialize(argv, parent);
          const hydrated = {
            transfer: transferName,
            raw: sr[0],
            [transfused]: true
          };
          weakCache == null ? void 0 : weakCache.set(argv, hydrated);
          transfers.push(...sr[1] || []);
          argvMap[index] = hydrated;
          break whileMain;
        }
      }
      if (argv && typeof argv === "object") {
        const newArgvMapForArgv = Array.isArray(argv) ? [] : {};
        weakCache == null ? void 0 : weakCache.set(argv, newArgvMapForArgv);
        keys(argv).forEach((key) => {
          if (key === "__proto__") {
            return;
          }
          const mapArgv = argumentsToArgvMap([argv[key]], argv, weakCache);
          newArgvMapForArgv[key] = mapArgv.value[0];
          transfers.push(...mapArgv.transfers);
        });
        argvMap[index] = newArgvMapForArgv;
        index++;
        continue;
      }
      argvMap[index] = argv;
      index++;
    }
  weakCache = null;
  return {
    value: argvMap,
    transfers
  };
}
function argvMapToArguments(argvMaps, weakCache = /* @__PURE__ */ new WeakMap()) {
  const argvs = [];
  const { length } = argvMaps;
  let index = 0;
  while (index < length) {
    const argvMap = argvMaps[index];
    if (weakCache == null ? void 0 : weakCache.has(argvMap)) {
      argvs[index] = weakCache.get(argvMap);
      index++;
      continue;
    }
    if (argvMap == null ? void 0 : argvMap[transfused]) {
      if (transfersInstalled.has(argvMap.transfer)) {
        argvs[index] = transfersInstalled.get(argvMap.transfer).deserialize(argvMap);
        index++;
        continue;
      }
    }
    if (argvMap && typeof argvMap === "object") {
      const newArgvForArgvMap = Array.isArray(argvMap) ? [] : {};
      weakCache == null ? void 0 : weakCache.set(argvMap, newArgvForArgvMap);
      keys(argvMap, false).forEach((key) => {
        if (key === "__proto__") {
          return;
        }
        newArgvForArgvMap[key] = argvMapToArguments([argvMap[key]], weakCache)[0];
      });
      argvs[index] = newArgvForArgvMap;
      index++;
      continue;
    }
    argvs[index] = argvMap;
    index++;
  }
  weakCache = null;
  return argvs;
}
function windowEndpoint(w, context = self, targetOrigin = "*") {
  return {
    postMessage: (msg, transferables) => w.postMessage(msg, targetOrigin, transferables),
    addEventListener: context.addEventListener.bind(context),
    removeEventListener: context.removeEventListener.bind(context)
  };
}
installTransfer("function", {
  canHandle: (value) => typeof value === "function",
  serialize: (fn, parent) => {
    const { port1, port2 } = new MessageChannel();
    expose(fn, port1, parent);
    const { value, transfers } = argumentsToArgvMap([
      Object.assign(Object.create(fn), {
        prototype: void 0
      })
    ]);
    return [
      {
        port: port2,
        property: value[0],
        toString: fn.toString()
      },
      [port2, ...transfers]
    ];
  },
  deserialize: ({ raw: { port, property, toString } }) => {
    const noop = () => {
    };
    const proto = {
      toString() {
        return toString;
      }
    };
    Object.getOwnPropertyNames(noop).forEach((prop) => {
      switch (prop) {
        case "caller":
        case "calle":
          proto[prop] = self;
          break;
        case "arguments":
          proto[prop] = [];
          break;
        case "bind":
        case "call":
        case "apply":
          break;
        default:
          if (typeof noop[prop] === "function") {
            proto[prop] = noop[prop].bind(noop);
          } else {
            proto[prop] = noop[prop];
          }
      }
    });
    return toProxy(port, [], Object.assign(proto, argvMapToArguments([property])[0]));
  }
});
installTransfer("error", {
  canHandle: (value) => value instanceof Error || (value == null ? void 0 : value[throwError]),
  serialize: (value) => {
    let serialized;
    if (value instanceof Error) {
      serialized = {
        isError: true,
        value: {
          message: value.message,
          name: value.name,
          stack: value.stack
        }
      };
      const props = keys(value);
      props.forEach((prop) => {
        if (typeof value[prop] === "function") {
          return;
        }
        serialized.value[prop] = value[prop];
      });
    } else {
      serialized = { isError: false, value };
    }
    return [serialized, []];
  },
  deserialize: ({ raw: serialized }) => {
    if (serialized.isError) {
      throw Object.assign(new Error(serialized.value.message), serialized.value);
    }
    throw serialized.value;
  }
});
function _arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  let i = 0;
  while (i < len) {
    binary += String.fromCharCode(bytes[i++]);
  }
  return _btoa(binary);
}
function _base64ToArrayBuffer(base64) {
  const binary_string = _atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  let i = 0;
  while (i < len) {
    bytes[i] = binary_string.charCodeAt(i++);
  }
  return bytes.buffer;
}
var TypedArrayConstructors = [
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
];
function getNameTypedArrayConstructorUsed(typed) {
  var _a;
  return (_a = TypedArrayConstructors.find((typedArrayItem) => typed instanceof typedArrayItem)) == null ? void 0 : _a.name;
}
installTransfer("arraybuffer", {
  canHandle: (value) => value instanceof ArrayBuffer,
  serialize: (value) => [_arrayBufferToBase64(value), []],
  deserialize: ({ raw }) => _base64ToArrayBuffer(raw)
});
installTransfer("typedarray", {
  canHandle: (value) => !!getNameTypedArrayConstructorUsed(value),
  serialize: (value) => [
    {
      typedArrayName: getNameTypedArrayConstructorUsed(value),
      base64: _arrayBufferToBase64(value.buffer)
    },
    []
  ],
  deserialize: ({ raw }) => {
    const typedArrayItem = TypedArrayConstructors.find((typedArrayItem2) => typedArrayItem2.name === raw.typedArrayName);
    return new typedArrayItem(_base64ToArrayBuffer(raw.base64));
  }
});

// src/workercom-extra.js
var bundleURL;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }
  return bundleURL;
}
function getBundleURL() {
  try {
    throw new Error();
  } catch (err) {
    const matches = ("" + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }
  return "/";
}
function getBaseURL(url) {
  return ("" + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)?\/[^/]+(?:\?.*)?$/, "$1") + "/";
}
var isAbsoluteURL = (value) => /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value);
function createSourceBlobURL(code) {
  const blob = new Blob([code], { type: "application/javascript" });
  return URL.createObjectURL(blob);
}
var WebWorker = class extends Worker {
  constructor(url, options) {
    var _a, _b;
    if (typeof url === "string" && options && options._baseURL) {
      url = new URL(url, options._baseURL);
    } else if (typeof url === "string" && !isAbsoluteURL(url) && getBundleURLCached().match(/^file:\/\//i)) {
      url = new URL(url, getBundleURLCached().replace(/\/[^/]+$/, "/"));
      if ((_a = options == null ? void 0 : options.CORSWorkaround) != null ? _a : true) {
        url = createSourceBlobURL(`importScripts(${JSON.stringify(url)});`);
      }
    }
    if (typeof url === "string" && isAbsoluteURL(url)) {
      if ((_b = options == null ? void 0 : options.CORSWorkaround) != null ? _b : true) {
        url = createSourceBlobURL(`importScripts(${JSON.stringify(url)});`);
      }
    }
    super(url, options);
  }
};
var __events = {};
function on(event, callback) {
  if (!__events[event]) {
    __events[event] = [];
  }
  __events[event].push(callback);
}
function fire(event, data = {}) {
  var _a;
  (_a = __events[event]) == null ? void 0 : _a.forEach((callback) => {
    callback(data);
  });
}
function __expose(value, ep = self) {
  expose({ exposed: value, on });
}
function __wrap(ep) {
  const wrappedWorker = wrap(ep);
  const proxyWorker = new Proxy(wrappedWorker, {
    apply: function(target, thisArg, argumentsList) {
      return target.exposed(...argumentsList);
    },
    get: function(target, prop, receiver) {
      return prop === "on" ? target.on : prop ? target.exposed[prop] : target.exposed;
    }
  });
  return proxyWorker;
}
