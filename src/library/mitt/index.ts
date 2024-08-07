import mitt, { type Emitter, type EventHandlerMap, type EventType, type Handler } from 'mitt'

export interface EmitterOnce<Events extends Record<EventType, unknown>> extends Emitter<Events> {
  /**
   * 新增的 once 方法
   *
   * @example
   * const emitter = new mittOnce();
   * emitter.once('test', () => console.log('Hello World'));
   * emitter.emit('test'); // 输出 Hello World
   * emitter.emit('test'); // 无效果
   */
  once<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void
}

/**
 * 一个添加了 once 方法的 mitt
 */
export default function mittOnce<Events extends Record<EventType, unknown>>(
  all?: EventHandlerMap<Events>
): EmitterOnce<Events> {
  const emitter = mitt<Events>(all)

  return {
    // 继承原生 mitt 的方法
    ...emitter,

    once<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>) {
      emitter.on(type, function fn(evt: Events[Key]) {
        emitter.off(type, fn)
        handler(evt)
      })
    }
  }
}
