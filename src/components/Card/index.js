import React from 'react'
import classnames from 'classnames'
import styles from './index.less'

const Card = (props) => {
  const { children, className, style = {} } = props

  return (
    <div className={classnames(styles.card, className)} style={style}>
      {children}
    </div>
  )
}

export default Card
