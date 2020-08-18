import React from 'react'
import { Col } from 'antd'
import classNames from 'classnames'
import { isEmpty } from '@/utils'
import styles from './index.less'

const Item = ({
  label,
  children,
  col,
  column,
  itemClassName,
  className,
  title,
  labelWidth,
  colon
}) => {
  // 子col 父column
  col = col ? 24 / col : ''
  const contentProps = title ? { title: children } : {}
  const labelStyle = {
    width: labelWidth !== undefined ? labelWidth : 'auto'
  }
  return (
    <Col span={col || column} className={classNames(styles.item, itemClassName, className)}>
      <div className="label" style={labelStyle}>
        {label}
        {colon && '：'}
      </div>
      <div className="content" {...contentProps}>
        {isEmpty(children) ? '-' : children}
      </div>
    </Col>
  )
}

export default Item
