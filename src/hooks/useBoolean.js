import { useState, useCallback } from 'react'
import usePersistFn from '@/hooks/usePersistFn'

/**
 * 控制变量是与否
 * @param {boolean} defaultValue
 */
const useBoolean = (defaultValue = false) => {
  const [state, setState] = useState(defaultValue)

  const toggle = usePersistFn((value) => {
    if (value !== undefined) {
      setState(value)
      return
    }
    const reverseState = state === defaultValue ? !defaultValue : defaultValue
    setState(reverseState)
  })

  const setTrue = useCallback(() => toggle(true), [toggle])

  const setFalse = useCallback(() => toggle(false), [toggle])

  return [state, { toggle, setTrue, setFalse }]
}

export default useBoolean
