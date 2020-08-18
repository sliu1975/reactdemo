import { useState } from 'react'

function getInitialKeyMap(columns) {
  const keyMap = {}
  for (let column of columns) {
    keyMap[column.dataIndex] = {
      title: column.title
    }
  }
  return keyMap
}

// 设置每一个column的属性
const useColumnsMap = (columns) => {
  const [columnsKeyMap, setColumnsKeyMap] = useState(() => getInitialKeyMap(columns))

  const resetColumnsKeyMap = () => {
    setColumnsKeyMap(getInitialKeyMap(columns))
  }

  return [columnsKeyMap, setColumnsKeyMap, resetColumnsKeyMap]
}

export default useColumnsMap
