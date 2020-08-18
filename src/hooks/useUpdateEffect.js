import { useEffect, useRef } from 'react'
import usePersistFn from '@/hooks/usePersistFn'

function useUpdateEffect(fn, deps) {
  const fnPersist = usePersistFn(fn)

  const mountRef = useRef(false)
  useEffect(() => {
    if (!mountRef.current) {
      mountRef.current = true
    } else {
      return fnPersist()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export default useUpdateEffect
