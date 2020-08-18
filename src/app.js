import React from 'react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'

export const dva = {
  config: {
    onReducer: (reducer) => {
      return (state, action) => {
        // 退出登录清空数据
        if (action.type === 'USER_LOGOUT') {
          state = undefined
        }
        return reducer(state, action)
      }
    },
    onError(err) {
      err.preventDefault()
      console.error(err.message)
    }
  }
}

export function rootContainer(container) {
  return <ConfigProvider locale={zhCN}>{container}</ConfigProvider>
}
