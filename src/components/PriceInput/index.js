import React from 'react'
import { Input } from 'antd'

const PriceReg = /^(0|[1-9][0-9]*)(\.[0-9]{0,2})?$/
// 负数
const PriceWithNegativeReg = /^-?(0|[1-9][0-9]*)(\.[0-9]{0,2})?$/

// 金额输入框
const PriceInput = React.forwardRef((props, ref) => {
  const { allowNegative, value, onChange, onBlur, ...rest } = props

  const handleChange = (e) => {
    let { value } = e.target

    let reg = PriceReg
    if (allowNegative) reg = PriceWithNegativeReg
    if ((!isNaN(value) && reg.test(value)) || value === '' || (allowNegative && value === '-')) {
      // 超过千亿忽略
      if (!isNaN(value) && parseInt(value).toString().length > 12) return

      onChange(value)
    }
  }

  const handleBlur = () => {
    if (value.charAt(value.length - 1) === '.' || value === '-') {
      onChange(value.slice(0, -1))
    }
    if (onBlur) {
      onBlur()
    }
  }

  return <Input {...rest} ref={ref} value={value} onChange={handleChange} onBlur={handleBlur} />
})

export default PriceInput
