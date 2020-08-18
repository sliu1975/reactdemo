import React from 'react'
import { Tree, Spin } from 'antd'
import styles from './index.less'

// 基于Form的角色列表Tree
const FormRoleTree = (props) => {
  const { loading = false, value, onChange, ...treeProps } = props

  const handleCheck = (checkedKeys, { halfCheckedKeys }) => {
    onChange && onChange({ checked: checkedKeys, halfChecked: halfCheckedKeys })
  }

  return (
    <div className={styles.tree}>
      <Spin spinning={loading}>
        <Tree
          {...treeProps}
          selectable={false}
          checkable
          checkedKeys={value?.checked}
          onCheck={handleCheck}
        ></Tree>
      </Spin>
    </div>
  )
}

export default FormRoleTree
