import { useState, useCallback } from 'react'
import { produce } from 'immer'

const useImmerState = (initialState) => {
  const [state, setState] = useState(initialState)
  const setImmerState = useCallback((next) => {
    if (typeof next === 'function') {
      setState((state) => produce(state, next))
    } else {
      setState(next)
    }
  }, [])

  return [state, setImmerState]
}

export default useImmerState
