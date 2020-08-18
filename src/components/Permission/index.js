import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

const AdminOperId = 1

function hasPermission(permissions, auth, isAdmin = false, isFull = false) {
  if (isAdmin) return true
  if (!Array.isArray(auth)) auth = [auth]
  if (isFull) {
    // 权限要都有
    return auth.every((a) => permissions.some((p) => p.perms === a))
  }
  // 至少有一个权限
  return permissions.some((permission) => auth.includes(permission.perms))
}

// hook
export const usePermission = (auth, isFull = false) => {
  const permissions = useSelector(({ user }) => user.permissions)
  const isAdmin = useSelector(({ user }) => user?.user?.operId === AdminOperId)
  const [hasAuth, setAuth] = useState(() => hasPermission(permissions, auth, isAdmin, isFull))

  useEffect(() => {
    setAuth(hasPermission(permissions, auth, isAdmin, isFull))
  }, [auth, isAdmin, isFull, permissions])

  return hasAuth
}

// 权限控制
const Permission = (props) => {
  return props.children
}

export default Permission
