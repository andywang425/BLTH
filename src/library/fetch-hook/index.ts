import { unsafeWindow } from '$'

interface Ihandler {
  resolve: (response: any) => void
  reject: (error: any) => void
  next: () => void
}

type onRequestHandler = (
  config: { input: RequestInfo | URL; init?: RequestInit },
  handler: Ihandler
) => void

type onResponseHandler = (response: Response, handler: Ihandler) => void

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
  const _requestHandler: Ihandler = {
    resolve: (response: Response) => (requestHandlerResolve = Promise.resolve(response)),
    reject: (response: Response) => (requestHandlerReject = Promise.reject(response)),
    next: () => (requestHandlerNext = true)
  }
  for (const handler of onRequestHandlers) {
    handler.apply(unsafeWindow, [{ input, init }, _requestHandler])
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
  const response = await _fetch.apply(unsafeWindow, [input, init])
  let responseHandlerResolve: Promise<Response> | undefined = undefined,
    responseHandlerReject: Promise<Response> | undefined = undefined,
    responseHandlerNext: boolean = false
  const _responseHandler: Ihandler = {
    resolve: (response: any) => (responseHandlerResolve = Promise.resolve(response)),
    reject: (error: any) => (responseHandlerReject = Promise.reject(error)),
    next: () => (responseHandlerNext = true)
  }
  for (const handler of onResponseHandlers) {
    handler.apply(unsafeWindow, [response, _responseHandler])
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
  return response
}

const fproxy = (proxy: Iproxy) => {
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
          onResponseHandlers.findIndex((handler) => handler === proxy.onRequest),
          1
        )
      }
    },
    originFetch: _fetch
  }
}

export { fproxy }
