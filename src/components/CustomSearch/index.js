import React, { useState, useCallback } from 'react'
import { Input } from 'antd'
import Icon from '@/components/Icon'

const CustomSearch = (props) => {
  const { onSearch, value: propsValue, onChange, ...inputProps } = props

  const [value, setValue] = useState(propsValue)

  if ('value' in props && value !== propsValue) {
    setValue(propsValue)
  }

  const handleChange = (e) => {
    const v = e.target.value
    if (!('value' in props)) {
      setValue(v)
    }
    onChange && onChange(v)
  }

  const handleSearch = useCallback(() => {
    onSearch && onSearch(value)
  }, [value, onSearch])

  return (
    <Input
      {...inputProps}
      value={value}
      onChange={handleChange}
      onPressEnter={handleSearch}
      suffix={<Icon type="icon-component-search" onClick={handleSearch} />}
    ></Input>
  )
}

export default CustomSearch
