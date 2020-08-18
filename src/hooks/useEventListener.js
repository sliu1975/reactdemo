import { useEffect, useRef } from 'react'

function useEventListener(eventName, handler, options) {
  const ref = useRef()
  const savedHandler = useRef()

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    const passedInElement =
      options && (typeof options.dom === 'function' ? options.dom() : options.dom)
    let element = passedInElement ? passedInElement : ref.current || window
    const isSupported = element.addEventListener
    if (!isSupported) return
    const eventListener = (event) => savedHandler.current && savedHandler.current(event)

    element.addEventListener(eventName, eventListener, {
      capture: options?.capture,
      once: options?.once,
      passive: options?.passive
    })

    return () => {
      element.removeEventListener(eventName, eventListener, {
        capture: options?.capture
      })
    }
  }, [eventName, options])
  return ref
}

export default useEventListener
