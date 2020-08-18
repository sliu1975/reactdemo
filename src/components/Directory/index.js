import React, { useMemo } from 'react'
import { Divider, Spin, Tree, Dropdown, Empty } from 'antd'
import classNames from 'classnames'
import CustomSearch from '@/components/CustomSearch'
import useSearch from './useSearch'
import { mapTree } from './utils'
import styles from './index.less'

const Directory = (props) => {
  const {
    loading = false,
    placeholder,
    searchType,
    contextMenu,
    treeData = [],
    treeClassName,
    ...treeProps
  } = props

  const [treeState, searchedTreeData, { onSearchChange, onTreeExpand }] = useSearch(
    treeData,
    searchType
  )

  // 右键菜单
  const formatedTreeData = useMemo(() => {
    if (!contextMenu) return searchedTreeData
    return mapTree(searchedTreeData, function(node, _, level) {
      // 默认是都有菜单
      if (node.contextMenu === false || node.disabled) return node
      let { title } = node
      const overlay = typeof contextMenu === 'function' ? contextMenu(node, level) : contextMenu
      title = (
        <Dropdown overlay={overlay} trigger={['contextMenu']}>
          {title}
        </Dropdown>
      )
      return { ...node, title }
    })
  }, [contextMenu, searchedTreeData])

  const isSingleLevel = useMemo(
    () => !treeData.some((node) => Array.isArray(node.children) && node.children.length),
    [treeData]
  )
  return (
    <div className={classNames(styles.tree, { [styles.singleTree]: isSingleLevel })}>
      <CustomSearch placeholder={placeholder} onChange={onSearchChange} />
      <Divider style={{ margin: '16px 0 8px' }} />

      <Spin spinning={loading}>
        {Array.isArray(formatedTreeData) && formatedTreeData.length ? (
          <Tree
            {...treeProps}
            className={treeClassName}
            showIcon
            blockNode
            onExpand={onTreeExpand}
            expandedKeys={treeState.expandedKeys}
            autoExpandParent={treeState.autoExpandParent}
            treeData={formatedTreeData}
          ></Tree>
        ) : (
          <Empty description={false} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Spin>
    </div>
  )
}

export * from './utils'
export { default as useSearch } from './useSearch'
export default Directory
