import React from 'react'
import { Input } from 'antd'

// 检测是否需要改变Input
class ConditionInput extends React.Component {
  onChange = (e) => {
    const { shouldUpdate, onChange } = this.props
    const { value } = e.target

    if (shouldUpdate(value)) {
      onChange(value)
    }
  }

  render() {
    const { shouldUpdate, ...restProps } = this.props
    return <Input {...restProps} onChange={this.onChange} onBlur={this.onBlur} />
  }
}

export default ConditionInput
