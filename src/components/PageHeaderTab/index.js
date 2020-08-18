import React from 'react'
import { Tabs } from 'antd'
import styles from './index.less'

const { TabPane } = Tabs

// 页面Header的tabbar
const PageHeaderTab = (props) => {
  const { value, onChange, tabs } = props

  return (
    <Tabs className={styles.tab} value={value} onChange={onChange} animated={false}>
      {Array.isArray(tabs) && tabs.map((tab) => <TabPane tab={tab.name} key={tab.value}></TabPane>)}
    </Tabs>
  )
}

export default PageHeaderTab
