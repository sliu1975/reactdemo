import React from 'react'
import { Row } from 'antd'
import classNames from 'classnames'

class Description extends React.Component {
  renderChildren() {
    const { children, column, labelWidth, colon, itemClassName } = this.props
    return React.Children.map(children, (child) => {
      if (!child) return null
      return React.cloneElement(child, {
        column: column ? 24 / column : 12,
        labelWidth,
        colon,
        itemClassName
      })
    })
  }

  render() {
    const { className } = this.props
    return (
      <Row gutter={16} className={classNames(className)}>
        {this.renderChildren()}
      </Row>
    )
  }
}

export default Description
