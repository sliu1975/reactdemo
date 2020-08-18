import React from 'react'
import classnames from 'classnames'
import styles from './index.less'

function DescriptionTitle({ className, style, children }) {
  return (
    <div className={classnames(styles.title, className)} style={style}>
      {children}
    </div>
  )
}

export default DescriptionTitle
