import React, { useEffect, useState } from 'react'
import { connect } from 'dva'
import Redirect from 'umi/redirect'
import { Layout } from 'antd'
import GlobalHeader from '@/components/GlobalHeader'
import SiderMenu from '@/components/SiderMenu'
import Authorized from '@/pages/Authorized'
import { fetchToken } from '@/common/token'
import styles from './BasicLayout.less'
import menu from '../../config/menu.config'

const { Content } = Layout

const BasicLayout = (props) => {
  const { dispatch, user, location } = props

  const token = fetchToken()
  const isLogin = !!token

  useEffect(() => {
    // 获取用户信息
    if (isLogin) {
      dispatch({
        type: 'user/fetchUser'
      })
    }
  }, [dispatch, isLogin])

  useEffect(() => {
    // 当路由切换时 滚动到页面顶部
    window.scrollTo(0, 0)
  }, [location])

  // 侧边栏是否开关
  const [collapsed, setCollapsed] = useState(false)

  return isLogin ? (
    <Layout className={styles.container}>
      <GlobalHeader name={user?.userName} menu={menu} />
      <Layout className={styles.content}>
        <SiderMenu menu={menu} onChange={setCollapsed} />
        <Content
          className={styles.main}
          style={collapsed ? { paddingLeft: 80 } : { paddingLeft: 180 }}
        >
          {/* <Authorized user={user} location={location}> */}
          {props.children}
          {/* </Authorized> */}
        </Content>
      </Layout>
    </Layout>
  ) : (
    <Redirect to="/user/login" />
  )
}

const mapStateToProps = ({ user }) => ({
  user: user.user,
  menu: user.menu
})

export default connect(mapStateToProps)(BasicLayout)
