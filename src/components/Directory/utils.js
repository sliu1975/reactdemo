// 将树平铺
export function flattenTreeData(data) {
  const treeDataList = []
  const flat = (nodes, parentKey = -1) => {
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i]
      const { key, title } = node
      treeDataList.push({ key, title, parentKey })
      if (Array.isArray(node.children)) flat(node.children, key)
    }
  }
  flat(data)
  return treeDataList
}

// 遍历树
const rootNode = { key: -1, title: '-' }
export function mapTree(tree, fn, level = 1, parentNode = rootNode) {
  const nextLevel = level + 1
  return tree.map((treeNode, treeIndex) => {
    const newTreeNode = fn(treeNode, treeIndex, level)
    return {
      ...newTreeNode,
      children: mapTree(treeNode?.children || [], fn, nextLevel, newTreeNode),
      parentNode
    }
  })
}

// 根据key找node
export function findTreeNodeByKey(tree = [], key, keyName = 'key') {
  let node = null
  for (let i = 0; i < tree.length; i++) {
    if (tree[i][keyName] === key) {
      node = tree[i]
      break
    }
    const childTree = tree[i].children
    if (Array.isArray(childTree) && childTree.length) {
      node = findTreeNodeByKey(childTree, key, keyName)
      if (node) break
    }
  }
  return node
}

// 根据id 找父级到-1为止 返回父节点所有id
export function findParentNodeKeysBykey(tree = [], key, keyName = 'key') {
  let nodeKeys = []
  if (key === void 0) return nodeKeys

  _getParentNodes([], key, tree)

  function _getParentNodes(history, key, tree) {
    return tree.some((node) => {
      const children = node.children || []
      if (node[keyName] === key) {
        nodeKeys = history
        return true
      } else if (children.length > 0) {
        const his = [...history]
        history.push(node[keyName])
        return _getParentNodes(his, key, children)
      }
      return false
    })
  }

  return nodeKeys
}
