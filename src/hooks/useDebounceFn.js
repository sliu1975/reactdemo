import { useRef, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom'

/**
 * 防抖
 * @param {function}} fn
 * @param {number} interval
 */
const useDebounceFn = (fn, interval) => {
  const fnRef = useRef(fn)
  useEffect(() => {
    fnRef.current = fn
  }, [fn])

  const timerRef = useRef(null)
  const debounceFn = useCallback(
    (...args) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        ReactDOM.unstable_batchedUpdates(() => {
          fnRef.current(...args)
        })
      }, interval)
    },
    [interval]
  )

  // 卸载时清除
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return debounceFn
}

export default useDebounceFn
