import { unsafeWindow } from '$'

interface IrequestConfig {
  input: RequestInfo | URL
  init?: RequestInit
}

interface IrequestHandler {
  resolve: (response: any) => void
  reject: (error: any) => void
  next: (config: IrequestConfig) => void
}

interface IresponseHandler {
  resolve: (response: any) => void
  reject: (error: any) => void
  next: (response: Response) => void
}

type onRequestHandler = (config: IrequestConfig, handler: IrequestHandler) => void

type onResponseHandler = (response: Response, handler: IresponseHandler) => void

interface Iproxy {
  onRequest?: onRequestHandler
  onResponse?: onResponseHandler
}

const _fetch = window.fetch

const onRequestHandlers: onRequestHandler[] = []
const onResponseHandlers: onResponseHandler[] = []

unsafeWindow.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  // 发起请求前
  let requestHandlerResolve: Promise<Response> | undefined = undefined,
    requestHandlerReject: Promise<Response> | undefined = undefined,
    requestHandlerNext: boolean = false
  const requestHandler: IrequestHandler = {
    resolve: (response: Response) => (requestHandlerResolve = Promise.resolve(response)),
    reject: (response: Response) => (requestHandlerReject = Promise.reject(response)),
    next: (config: IrequestConfig) => {
      requestHandlerNext = true
      input = config.input
      init = config.init
    }
  }
  for (const handler of onRequestHandlers) {
    handler.apply(unsafeWindow, [{ input, init }, requestHandler])
    if (requestHandlerResolve) {
      return requestHandlerResolve
    } else if (requestHandlerReject) {
      return requestHandlerReject
    } else if (requestHandlerNext) {
      continue
    } else {
      break
    }
  }
  // 收到响应后
  let res = await _fetch.apply(unsafeWindow, [input, init])
  let responseHandlerResolve: Promise<Response> | undefined = undefined,
    responseHandlerReject: Promise<Response> | undefined = undefined,
    responseHandlerNext: boolean = false
  const responseHandler: IresponseHandler = {
    resolve: (response: any) => (responseHandlerResolve = Promise.resolve(response)),
    reject: (error: any) => (responseHandlerReject = Promise.reject(error)),
    next: (response: Response) => {
      responseHandlerNext = true
      res = response
    }
  }
  for (const handler of onResponseHandlers) {
    handler.apply(unsafeWindow, [res, responseHandler])
    if (responseHandlerResolve) {
      return responseHandlerResolve
    } else if (responseHandlerReject) {
      return responseHandlerReject
    } else if (responseHandlerNext) {
      continue
    } else {
      break
    }
  }
  return res
}

const fproxy = (proxy: Iproxy): { unHook: () => void; originFetch: typeof fetch } => {
  if (proxy.onRequest) {
    onRequestHandlers.push(proxy.onRequest)
  }
  if (proxy.onResponse) {
    onResponseHandlers.push(proxy.onResponse)
  }
  return {
    unHook: () => {
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
    originFetch: _fetch
  }
}

export { fproxy }
