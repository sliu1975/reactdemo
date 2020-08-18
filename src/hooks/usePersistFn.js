import { useCallback, useRef, useEffect } from 'react'

function usePersistFn(fn) {
  const ref = useRef(() => {
    throw new Error('Cannot call an event handler while rendering.')
  })

  useEffect(() => {
    ref.current = fn
  }, [fn])

  const persist = useCallback((...args) => {
    const fn = ref.current
    if (fn) {
      return fn(...args)
    }
  }, [])

  if (typeof fn === 'function') {
    return persist
  } else {
    return undefined
  }
}

export default usePersistFn
