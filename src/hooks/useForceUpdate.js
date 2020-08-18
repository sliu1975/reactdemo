import { useState, useCallback } from 'react'

const useForceUpdate = () => {
  const [state, setState] = useState()
  const forceUpdate = useCallback(() => {
    setState((s) => !s)
  }, [])
  return [state, forceUpdate]
}

export default useForceUpdate
