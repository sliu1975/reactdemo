import React from 'react'
import router from 'umi/router'
import { Menu, Dropdown, notification } from 'antd'
import { removeToken } from '@/common/token'
import { useBoolean } from '@/hooks'
import ModifyPwdModal from './components/ModifyPwdModal'
import styles from './index.less'

import Icon from '@/components/Icon'
import useRequest from '@/hooks/useRequest'
import api from 'api'
import logo from 'img/logo-text.png'
import { MailOutlined } from '@ant-design/icons'
import cls from 'classnames'

const { message } = api

let first = null

const GlobalHeader = (props) => {
  const { name } = props

  let timeout = 3000
  if (process.env.NODE_ENV === 'development') {
    // timeout = 30000
  }

  const show = () => {
    notification.info({
      message: '消息通知',
      description: '您有新的消息, 请查收',
      className: 'custom-class',
      top: 50,
      icon: <MailOutlined className={styles.msgIcon} />,
      style: {
        width: 280,
        float: 'right',
      },
      // duration: null,
    })
  }

  const { data: messageList = [] } = useRequest(message, [], {pollingInterval: timeout,
    onSuccess: (messageList) => {
      if (messageList?.length) {
        if (!first) {
          first = messageList[0]?.id
          show()
        } else {
          const tmp = messageList[0]?.id
          if (tmp && tmp !== first) {
            first = tmp
            show()
          }
        }
      }
    }
  })

  const handleLogout = () => {
    // logout()
    removeToken()
    router.replace('/user/login')
  }
  const [isShowPwd, { setTrue: showPwd, setFalse: hidePwd }] = useBoolean()
  const handlePwdSuccess = () => {
    hidePwd()
    handleLogout()
  }
  const onMenuClick = async ({ key }) => {
    switch (key) {
      case 'modifyPwd':
        showPwd()
        break
      case 'logout':
        handleLogout()
        break
      default:
        break
    }
  }

  const dropdownMenu = (
    <Menu className={styles.menu} onClick={onMenuClick}>
      <Menu.Item key="modifyPwd">
        <span>修改密码</span>
      </Menu.Item>
      <Menu.Item key="logout">
        <span>退出登录</span>
      </Menu.Item>
    </Menu>
  )

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.title}><img width="192" src={logo} alt=""/></div>
        <div style={{ flex: '1 1 0%' }} />

        <div className={styles.sepra}></div>

        <Dropdown overlay={dropdownMenu} placement="bottomRight">
          <div className={cls(styles.right, 'hide')}>
            <Icon type="icon-general-loginaccount" style={{fontSize: 18}} />
            个人中心
            {/*{name}*/}
          </div>
        </Dropdown>

      </div>
      <ModifyPwdModal
        visible={isShowPwd}
        onOk={handlePwdSuccess}
        onCancel={hidePwd}
      ></ModifyPwdModal>
    </header>
  )
}

export default GlobalHeader
