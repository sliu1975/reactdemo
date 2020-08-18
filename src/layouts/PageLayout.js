import React from 'react'
import BreadCrumb from '@/components/Breadcrumb'
import styles from './PageLayout.less'

const PageLayout = (props) => {
  const { extraHeader, children } = props
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageHeader}>
        <BreadCrumb />
        {extraHeader}
      </div>
      <div className={styles.pageContent}>{children}</div>
    </div>
  )
}

export default PageLayout
