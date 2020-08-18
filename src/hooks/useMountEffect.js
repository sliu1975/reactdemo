import { useEffect } from 'react'

function useMountEffect(fn) {
  useEffect(fn, [])
}

export default useMountEffect
