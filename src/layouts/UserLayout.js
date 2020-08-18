import React from 'react'
import styles from './UserLayout.less'

const UserLayout = (props) => {
  return <div className={styles.container}>{props.children}</div>
}

export default UserLayout
