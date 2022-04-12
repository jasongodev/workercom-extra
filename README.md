# ONGOING DEVELOPMENT. DOCUMENTATION TO FOLLOW.
---
# Workercom-Extra

Workercom-Extra makes [WebWorkers][webworker] enjoyable. This is an extended version of Workercom that includes event listener methods like on() and fire(), and an extended Worker class that serves worker script URL in a CORS-safe fashion. Workercom-Extra removes the mental barrier of thinking about `postMessage` and hides the fact that you are working with workers.

At a more abstract level it is an RPC implementation for `postMessage` and [ES6 Proxies][es6 proxy].

```
$ pnpm i workercom-extra
```

## Notable difference with [Comlink](https://npmjs.org/package/comlink) and [Workercom](https://github.com/tachibana-shin/workercom)

* Inherits all the improvements of Workercom over Comlink:
 - Remove unnecessary `Comlink.proxy` function (Workercom will find functions, transfering and hydrate them)
 - Allows callbacks to be nested within objects
 - Allows the proto object to refer back to itself
 - ***Default conversion support for [`function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function?retiredLocale=vi), [`class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes?retiredLocale=vi), [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error?retiredLocale=vi) family, [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) family*** and [OTHER](./structured-clone-table.md)
* The WorkercomExtra.wrap() adds an .on(event, callback) method which can be triggered by the fire method.
* The fire(event, data) method can be imported into the worker script.
* The browser's Worker class is extended to be able to handle different kinds of URL and will create URL Blobs if necessary so that scripts are loaded in CORS-safe fashion.

## Browsers support & bundle size

![Chrome 56+](https://img.shields.io/badge/Chrome-56+-green.svg?style=flat-square)
![Edge 15+](https://img.shields.io/badge/Edge-15+-green.svg?style=flat-square)
![Firefox 52+](https://img.shields.io/badge/Firefox-52+-green.svg?style=flat-square)
![Opera 43+](https://img.shields.io/badge/Opera-43+-green.svg?style=flat-square)
![Safari 10.1+](https://img.shields.io/badge/Safari-10.1+-green.svg?style=flat-square)
![Samsung Internet 6.0+](https://img.shields.io/badge/Samsung_Internet-6.0+-green.svg?style=flat-square)

Browsers without [ES6 Proxy] support can use the [proxy-polyfill].


[webworker]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API
[transferable]: https://developer.mozilla.org/en-US/docs/Web/API/Transferable
[messageport]: https://developer.mozilla.org/en-US/docs/Web/API/MessagePort
[delivrjs]: https://cdn.jsdelivr.net/
[es6 proxy]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
[proxy-polyfill]: https://github.com/GoogleChrome/proxy-polyfill
[endpoint]: src/index.ts
[structured cloning]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
[structured clone table]: structured-clone-table.md
[event]: https://developer.mozilla.org/en-US/docs/Web/API/Event
[worker_threads]: https://nodejs.org/api/worker_threads.html
[typedarray]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray

---

License [MIT](./LICENSE)