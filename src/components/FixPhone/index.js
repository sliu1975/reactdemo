import React, { Component } from 'react'
import { Input } from 'antd'
import styles from './index.less'

// 固定电话
class FixPhone extends Component {
  state = {
    areaCode: '',
    phoneNo: ''
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { value } = nextProps
    const newState = { prevValue: value }
    if (prevState.preValue !== value) {
      if (value === undefined) {
        newState.areaCode = ''
        newState.phoneNo = ''
      } else {
        newState.areaCode = value.split('-')[0] || ''
        newState.phoneNo = value.split('-')[1] || ''
      }
    }
    return newState
  }

  handleAreaCodeChange = (e) => {
    const { onChange } = this.props
    const v = e.target.value
    if (isNaN(v)) return
    this.setState({
      areaCode: v
    })
    const phone = v + '-' + this.state.phoneNo
    onChange && onChange(phone === '-' ? undefined : phone)
  }

  handlePhoneNoChange = (e) => {
    const { onChange } = this.props
    const v = e.target.value
    if (isNaN(v)) return
    this.setState({
      phoneNo: v
    })
    const phone = this.state.areaCode + '-' + v
    onChange && onChange(phone === '-' ? undefined : phone)
  }

  render() {
    const { areaCode, phoneNo } = this.state
    return (
      <div className={styles.fixphone}>
        <Input
          placeholder="区号"
          value={areaCode}
          style={{ width: 60 }}
          onChange={this.handleAreaCodeChange}
        ></Input>
        <span style={{ width: 24, textAlign: 'center' }}>-</span>
        <Input
          placeholder="号码"
          value={phoneNo}
          style={{ flex: 1 }}
          onChange={this.handlePhoneNoChange}
        ></Input>
      </div>
    )
  }
}

export default FixPhone
