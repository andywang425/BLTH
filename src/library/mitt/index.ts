import mitt, { Emitter, EventHandlerMap, EventType, Handler } from 'mitt'

export default function mittWithOnce<Events extends Record<EventType, unknown>>(
  all?: EventHandlerMap<Events>
) {
  const inst: any = mitt(all)

  inst.once = (type: any, handler: any) => {
    inst.on(type, handler)
    inst.on(type, inst.off.bind(inst, type, handler))
  }
  return inst as unknown as {
    once<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void
  } & Emitter<Events>
}
