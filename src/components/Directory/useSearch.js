import React, { useMemo, useRef, useCallback, useEffect } from 'react'
import { useImmerState, useDebounceFn } from '@/hooks'
import { isEmpty } from '@/utils'
import { flattenTreeData, mapTree } from './utils'
import styles from './index.less'

function isHighlight(text, searchValue) {
  return !isEmpty(searchValue) && text.includes(searchValue)
}

const initialState = {
  searchValue: undefined,
  expandedKeys: [],
  autoExpandParent: true
}

// 树搜索 支持高亮 匹配每一层的title
// 列表搜索 支持筛选 只匹配第一层的title
// searchType tree | list
function useSearch(treeData = [], searchType = 'tree') {
  const flatTreeData = useMemo(() => flattenTreeData(treeData), [treeData])

  const [treeState, setTreeState] = useImmerState(initialState)
  const treeStateRef = useRef(treeState)
  treeStateRef.current = treeState

  // 搜索
  const onSearchChange = useDebounceFn((searchValue) => {
    let expandedKeys
    if (searchType === 'tree') {
      expandedKeys = flatTreeData
        .map((item) => {
          if (isHighlight(item.title, searchValue)) {
            return item.parentKey.toString()
          }
          return false
        })
        .filter(Boolean)
    }

    setTreeState((s) => {
      // 树形 有搜索内容才设置展开
      if (searchType === 'tree' && !isEmpty(searchValue)) {
        s.expandedKeys = expandedKeys
      } else {
        // 列表都收缩
        s.expandedKeys = []
      }
      s.searchValue = searchValue
      s.autoExpandParent = true
    })
  }, 300)

  // 数据更新时
  useEffect(() => {
    onSearchChange(treeStateRef.current.searchValue)
  }, [onSearchChange, searchType, treeData])

  // 树展开
  const onTreeExpand = useCallback(
    (expandedKeys) => {
      setTreeState((s) => {
        s.expandedKeys = expandedKeys
        s.autoExpandParent = false
      })
    },
    [setTreeState]
  )

  const searchedTreeData = useMemo(() => {
    const searchValue = treeState.searchValue
    if (searchType === 'tree') {
      return mapTree(treeData, function(node, index, level) {
        let { title } = node
        if (!isEmpty(searchValue) && title?.includes(searchValue)) {
          const index = title.indexOf(searchValue)
          const beforeStr = title.substr(0, index)
          const afterStr = title.substr(index + searchValue.length)
          title = (
            <div className={styles.title} title={title}>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </div>
          )
        } else {
          title = (
            <div className={styles.title} title={title}>
              {title}
            </div>
          )
        }
        return { ...node, title: title }
      })
    } else {
      // 搜索内容为空 或 搜索内容匹配
      const filteredTreeData = treeData.filter(
        ({ title }) => isEmpty(searchValue) || title.includes(searchValue)
      )
      return mapTree(filteredTreeData, function(node) {
        let { title } = node
        title = (
          <div className={styles.title} title={title}>
            {title}
          </div>
        )
        return { ...node, title }
      })
    }
  }, [searchType, treeData, treeState.searchValue])

  return [treeState, searchedTreeData, { onSearchChange, onTreeExpand }]
}

export default useSearch
