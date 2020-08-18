import React, { Component } from 'react'
import styles from './Xselect.less'
import { Select, Input, InputNumber } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'

const { Option } = Select

class Xselect extends Component {

  state = {
    mode: 'select',
    input: '',
    score: 0,
  }

  handleSelectChange = (value) => {
    const { onChange } = this.props

    if (value === '其他') {
      this.setState({mode: 'input'})
      return
    }

    if (onChange) {
      onChange(value)
    }
  }

  clearValue = (e) => {
    const { onChange } = this.props
    e.stopPropagation()

    this.setState({mode: 'select'}, () => {
      onChange(void 0)
    })
  }

  render() {
    const { mode, input, score } = this.state
    const { children, onChange, ...rest } = this.props

    if (mode === 'select') {
      return (
        <Select {...rest} onChange={this.handleSelectChange}>
          {children}
          <Option value="其他">其他</Option>
        </Select>
      )
    } else {
      return (
        <div className={styles.inputAll}>
          <div className={styles.inputF1}>
            <Input value={input} suffix={<CloseCircleFilled onClick={this.clearValue} />} onChange={({target: {value}}) => {
              this.setState({input: value}, () => {
                onChange(`${value}|${score}`)
              })
            }} />
          </div>
          <div className={styles.score}>
            <InputNumber value={score} placeholder="分数" min={0} max={1000} onChange={(value) => {
              this.setState({score: value}, () => {
                onChange(`${input}|${value}`)
              })
            }} />
          </div>
        </div>
      )
    }

  }
}

export default Xselect
