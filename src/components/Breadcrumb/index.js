import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import pathToRegexp from 'path-to-regexp'
import Icon from '@/components/Icon'
import styles from './index.less'
import cls from 'classnames'

function getBreadcrumb(breadcrumbNameMap, url) {
  // 通过url获取对应的路由
  let breadcrumb = breadcrumbNameMap[url]
  if (!breadcrumb) {
    Object.keys(breadcrumbNameMap).forEach((item) => {
      if (pathToRegexp(item).test(url)) {
        breadcrumb = breadcrumbNameMap[item]
      }
    })
  }
  return breadcrumb || ''
}

const BreadcrumbView = (props) => {
  const { className } = props
  const { pathname } = useLocation()
  const breadcrumbNameMap = useSelector(({ user }) => user.breadcrumbNameMap)
  const breadcrumb = getBreadcrumb(breadcrumbNameMap, pathname)

  return (
    <div className={cls(styles.breadcrumb, className)}>
      {/* 需不需要返回按钮 */}
      {breadcrumb?.hasBack && (
        <Link to={breadcrumb.parentRoute.path}>
          <Icon className={styles.icon} type="icon-general-arrowleft"></Icon>
        </Link>
      )}
      <span>{breadcrumb?.name}</span>
    </div>
  )
}

export default BreadcrumbView
