import { unsafeWindow } from '$'

export interface IrequestConfig {
  input: RequestInfo | URL
  init?: RequestInit
}

export interface IrequestHandler {
  resolve: (response: Response) => void
  error: (error: Error) => void
  next: (config: IrequestConfig) => void
}

export interface IresponseHandler {
  resolve: (response: Response) => void
  error: (error: Error) => void
  next: (response: Response) => void
}

export type onRequestHandler = (config: IrequestConfig, handler: IrequestHandler) => void

export type onResponseHandler = (response: Response, handler: IresponseHandler) => void

export interface Iproxy {
  onRequest?: onRequestHandler
  onResponse?: onResponseHandler
}

const _fetch = window.fetch

class RequestHandler {
  _resolve: Promise<Response> | undefined
  _error: Error | undefined
  _next: boolean = false
  _input: IrequestConfig['input'] | undefined
  _init: IrequestConfig['init'] | undefined

  public resolve(response: Response) {
    this._resolve = Promise.resolve(response)
  }
  public error(error: Error) {
    this._error = error
  }
  public next(config: IrequestConfig) {
    this._next = true
    this._input = config.input
    this._init = config.init
  }
}

class ResponseHandler {
  _resolve: Promise<Response> | undefined
  _error: Error | undefined
  _next: boolean = false
  _response: Response | undefined

  public resolve(response: Response) {
    this._resolve = Promise.resolve(response)
  }
  public error(error: Error) {
    this._error = error
  }
  public next(response: Response) {
    this._next = true
    this._response = response
  }
}

let onRequestHandlers: onRequestHandler[] = []
let onResponseHandlers: onResponseHandler[] = []

const hook = (proxy: Iproxy, win: Window) => {
  if (proxy.onRequest) {
    onRequestHandlers.push(proxy.onRequest)
  }
  if (proxy.onResponse) {
    onResponseHandlers.push(proxy.onResponse)
  }

  win.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    // 发起请求前
    for (const handler of onRequestHandlers) {
      const requestHandler = new RequestHandler()
      handler.apply(unsafeWindow, [{ input, init }, requestHandler])
      if (requestHandler._resolve) {
        return requestHandler._resolve
      }
      if (requestHandler._error) {
        throw requestHandler._error
      }
      if (!requestHandler._next) {
        break
      }

      input = requestHandler._input as IrequestConfig['input']
      init = requestHandler._init as IrequestConfig['init']
    }
    // 发起请求
    let response = await _fetch.apply(unsafeWindow, [input, init])
    // 收到响应后
    for (const handler of onResponseHandlers) {
      const responseHandler = new ResponseHandler()
      handler.apply(unsafeWindow, [response, responseHandler])
      if (responseHandler._resolve) {
        return responseHandler._resolve
      }
      if (responseHandler._error) {
        throw responseHandler._error
      }
      if (!responseHandler._next) {
        break
      }

      response = responseHandler._response as Response
    }
    return response
  }
}

const fproxy = (
  proxy: Iproxy,
  win: Window = unsafeWindow
): {
  unProxy: () => void
  unHook: () => void
  originFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
} => {
  hook(proxy, win)

  return {
    unProxy: () => {
      if (proxy.onRequest) {
        onRequestHandlers.splice(
          onRequestHandlers.findIndex((handler) => handler === proxy.onRequest),
          1
        )
      }
      if (proxy.onResponse) {
        onResponseHandlers.splice(
          onResponseHandlers.findIndex((handler) => handler === proxy.onResponse),
          1
        )
      }
    },
    unHook: () => {
      win.fetch = _fetch
      onRequestHandlers = []
      onResponseHandlers = []
    },
    originFetch: _fetch
  }
}

export { fproxy }
