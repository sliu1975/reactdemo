import React from 'react'
import { connect } from 'dva'
import pathToRegexp from 'path-to-regexp'
import routes from '../../config/router.config'
import NotFound from './404'
import Exception403 from './403'

// 生成页面路由的正则
function formatterRoute(routes) {
  let formatedRoutes = []
  routes.forEach((route) => {
    // 有子路由时，当前路径必须全匹配
    if (Array.isArray(route.routes) && route.routes.length) {
      // 路径严格匹配
      if (route.component && route.path) {
        formatedRoutes.push(pathToRegexp(route.path))
      }
      formatedRoutes = formatedRoutes.concat(formatterRoute(route.routes))
    } else {
      // 路径严格匹配
      if (route.component && route.path) {
        formatedRoutes.push(pathToRegexp(route.path))
      }
    }
  })
  return formatedRoutes
}

// 白名单
const whiteList = [pathToRegexp('/')]
// 路由正则
const routesReg = formatterRoute(routes)

/**
 * 404校验
 */
function hasRoute(pathname) {
  return routesReg.some((reg) => {
    return reg.test(pathname)
  })
}

/**
 * 权限校验
 * @param pathname 当前路由
 * @param menuRegs
 */
function authorizedRoute(pathname, menuRegs) {
  return (
    whiteList.some((reg) => {
      return reg.test(pathname)
    }) ||
    menuRegs.some((reg) => {
      return reg.test(pathname)
    })
  )
}

const AuthComponent = ({ children, user, location, menuRegs }) => {
  // 没登录啥也不给看
  if (!user) return null
  // 跟路由比较判断是否有页面
  if (!hasRoute(location.pathname)) {
    return <NotFound></NotFound>
  }
  // 跟菜单比较判断是否有权限
  if (authorizedRoute(location.pathname, menuRegs)) {
    return children
  }
  return <Exception403></Exception403>
}

const mapStateToProps = ({ user }) => ({
  menuRegs: user.menuRegs
})

export default connect(mapStateToProps)(AuthComponent)
