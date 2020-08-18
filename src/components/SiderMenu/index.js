import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import Icon from '@/components/Icon'
import useBoolean from '@/hooks/useBoolean'
import { Scrollbars } from 'react-custom-scrollbars'
import styles from './index.less'

const { Sider } = Layout
const { SubMenu } = Menu

// 获取路由的某一段
const getMenuPath = (pathname, start, end) =>
  `/${pathname
    .split('/')
    .slice(start, end)
    .join('/')}`

const SiderMenu = ({ location, menu, onChange }) => {
  const { pathname } = location

  // 根据选中的导航菜单筛选出对应的侧边栏菜单
  const selectMenu = useMemo(() => {
    // 获取当前的导航栏菜单
    const nav = pathname
      .split('/')
      .slice(0, 2)
      .join('/')
    const currentNav = menu.find((m) => m.path === nav)
    return currentNav?.children || []
  }, [pathname, menu])

  const [openKeys, setOpenKeys] = useState([])
  const openKeysRef = useRef(openKeys)
  const [collapsed, { toggle: toggleCollapsed }] = useBoolean(false)
  useEffect(() => {
    openKeysRef.current = openKeys
  }, [openKeys])
  useEffect(() => {
    if (collapsed) return
    // 一级菜单路由
    const key = getMenuPath(pathname, 1, 3)
    // 主导航名称
    const nav = getMenuPath(pathname, 1, 2)
    const keys = openKeysRef.current
    const isCurrentNav = keys.some((k) => k.startsWith(nav))
    // 切换主导航就重新设置值
    if (!isCurrentNav) {
      // 全展开
      setOpenKeys(selectMenu.map((m) => m.path))
      return
    }
    // 当前主导航内页面切换时
    if (!keys.includes(key)) {
      setOpenKeys(keys.concat(key))
    }
  }, [pathname, collapsed, selectMenu])
  // 侧边菜单栏的关闭打开
  const handleMenuCollapsed = useCallback(() => {
    // 关 -> 开
    if (collapsed) {
      // 全展开
      // const key = getMenuPath(pathname, 1, 3)
      setOpenKeys(selectMenu.map((m) => m.path))
    } else {
      // 开 -> 关
      setOpenKeys([])
    }
    toggleCollapsed()
  }, [collapsed, selectMenu, toggleCollapsed])
  useEffect(() => {
    // 通知父组件更新
    onChange && onChange(collapsed)
  }, [collapsed, onChange])

  // 截取路径前三级为key
  const selectedKeys = useMemo(() => getMenuPath(pathname, 1, 4), [pathname])

  // fix: 如果没有子菜单的话，菜单collapsed的动画不太整齐
  const openKeysProps = useMemo(
    () => (collapsed ? undefined : { openKeys: openKeys, onOpenChange: setOpenKeys }),
    [collapsed, openKeys]
  )

  const renderSubMenuOrItem = useCallback((menu) => {
    return menu.map((node) => {
      // 如果有子菜单
      if (Array.isArray(node.children) && node.children.length > 0) {
        return (
          <SubMenu
            key={node.path}
            popupClassName={styles.popupMenuItem}
            title={
              <span>
                {node.icon ? (
                  <Icon type={`icon-${node.icon}`} />
                ) : (
                  <span className="anticon"></span>
                )}
                <span>{node.name}</span>
              </span>
            }
          >
            {renderSubMenuOrItem(node.children)}
          </SubMenu>
        )
      }
      return (
        <Menu.Item key={node.path}>
          <Link to={node.path}>
            {node.icon ? <Icon type={`icon-${node.icon}`} /> : null}
            <span>{node.name}</span>
          </Link>
        </Menu.Item>
      )
    })
  }, [])

  return (
    <Sider className={styles.sider} width={180} trigger={null} collapsible collapsed={collapsed}>
      <Scrollbars style={{ height: 'calc(100vh - 47px)' }}>
        <div className={styles.collapsedArea}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            onClick: handleMenuCollapsed,
            style: { fontSize: 20 }
          })}
        </div>
        <Menu
          mode="inline"
          theme="dark"
          {...openKeysProps}
          selectedKeys={selectedKeys}
          className={styles.menu}
        >
          {renderSubMenuOrItem(selectMenu)}
        </Menu>
      </Scrollbars>
    </Sider>
  )
}

export default withRouter(SiderMenu)
