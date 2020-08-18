import React from 'react'
import { Popover, Button, Checkbox } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import styles from './index.less'

// 设置表格列的显示与隐藏
const ColumnsSetting = (props) => {
  const { columnsKeyMap, setColumnsKeyMap, resetColumnsKeyMap } = props

  const title = (
    <div className={styles.title}>
      <span>筛选列</span>
      <Button type="link" onClick={resetColumnsKeyMap}>
        重置
      </Button>
    </div>
  )

  const content = (
    <div>
      {Object.keys(columnsKeyMap).map((columnKey) => (
        <div key={columnKey} style={{ lineHeight: '25px' }}>
          <Checkbox
            onChange={(e) => {
              // 设置属性
              const checked = e.target.checked
              const column = columnsKeyMap[columnKey]
              column.isShow = !!checked
              setColumnsKeyMap({
                ...columnsKeyMap,
                [columnKey]: column
              })
            }}
            checked={columnsKeyMap[columnKey].isShow !== false}
          >
            {columnsKeyMap[columnKey].title}
          </Checkbox>
        </div>
      ))}
    </div>
  )

  return (
    <Popover
      // overlayClassName={styles.popover}
      placement="bottomRight"
      autoAdjustOverflow={false}
      title={title}
      content={content}
      trigger="click"
    >
      <Button shape="rect" icon={<SettingOutlined />}></Button>
    </Popover>
  )
}

export { default as useColumnsMap } from './useColumnsMap'

export default ColumnsSetting
