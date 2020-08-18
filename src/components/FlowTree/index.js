import React, { useRef, useEffect } from 'react'
import cls from 'classnames'
import G6 from '@antv/g6'
import router from 'umi/router'
import styles from './index.less'
import { usePrevious } from '@/hooks'
import actionImg from '@/assets/action.svg'
import asstImg from '@/assets/asst.svg'

//联通、电信、移动、供电局、水业局、美团、建设银行、工商银行
const iconMap = {
  '供电局': '电网',
  '水业局': '水利',
  '建设银行': '建行',
  '工商银行': '工商',
}

function mapTree(tree, fn) {
  return tree.map((treeNode, treeIndex) => {
    const newTreeNode = fn(treeNode, treeIndex)
    return {
      ...newTreeNode,
      children: mapTree(treeNode?.children || [], fn)
    }
  })
}

G6.registerNode('tree-node', {
  draw(cfg, group) {
    console.log(cfg)
    const { modelType, queryInfo, selectedId, nodeId } = cfg
    const keyShape = group.addShape('rect', {
      attrs: {
        x: 0,
        y: 0,
        width: 64,
        height: 71,
        stroke: modelType === 'asst' ? '#338DFF' : '#F2A230',
        fill: '#ffffff',
        lineDash: nodeId === selectedId ? void 0 : [3, 3, 3]
      }
    })

    // 根据类型判断时协查还是布控
    group.addShape('image', {
      attrs: {
        x: 16,
        y: 6,
        width: 32,
        height: 32,
        img: modelType === 'asst' ? asstImg : actionImg,
        opacity: nodeId === selectedId ? 1 : 0.66
      }
    })
    // 标题
    group.addShape('text', {
      attrs: {
        x: 12,
        y: 53,
        text: this.getText(cfg),
        fill: modelType === 'asst' ? '#338DFF' : '#F2A230',
        fontWeight: 600,
        fontSize: 10,
        opacity: nodeId === selectedId ? 1 : 0.66
      }
    })
    // 查询条件
    const queryText = group.addShape('text', {
      attrs: {
        x: 5,
        y: 65,
        text: queryInfo,
        fill: 'rgba(22, 22, 64, 0.65)',
        fontWeight: 500,
        fontSize: 8,
        opacity: nodeId === selectedId ? 1 : 0.66
      }
    })
    if (keyShape.getBBox().width < queryText.getBBox().width) {
      queryText.attr({
        text: queryInfo.slice(0, 8) + '...'
      })
      queryText.attr({
        x: (keyShape.getBBox().width - queryText.getBBox().width) / 2
      })
    } else {
      queryText.attr({
        x: (keyShape.getBBox().width - queryText.getBBox().width) / 2
      })
    }

    return keyShape
  },
  getText(cfg) {
    const { modelType, depth } = cfg
    if (modelType === 'asst') {
      if (depth === 0) return '人工协查'
      return '自动协查'
    } else {
      if (depth === 0) return '人工布控'
      return '自动布控'
    }
  }
})

G6.registerEdge('tree-line', {
  draw(cfg, group) {
    const startPoint = cfg.startPoint
    const endPoint = cfg.endPoint
    const { modelType } = cfg.targetNode.getModel()
    const color = modelType === 'asst' ? '#338DFF' : '#F2A230'

    const shape = group.addShape('path', {
      attrs: {
        stroke: color,
        endArrow: {
          path: 'M 0,0 L 6,4 L 6,-4 Z',
          fill: color,
          d: -36
        },
        path: [
          ['M', startPoint.x, startPoint.y],
          ['L', startPoint.x, (startPoint.y + endPoint.y) / 2],
          ['L', endPoint.x, (startPoint.y + endPoint.y) / 2],
          ['L', endPoint.x, endPoint.y]
        ],
        opacity: 0.38
      }
    })

    return shape
  }
})

const FlowTree = (props) => {
  const { className, data, shouldRender, selectedId } = props

  const graphRef = useRef()
  const graphInstanceRef = useRef()
  const persistRef = useRef()
  const preSelectedId = usePrevious(selectedId)
  useEffect(() => {
    if (!data || !shouldRender) return
    let persist = ''
    const [treeData] = mapTree([data], function(node) {
      persist += node.id.toString()
      return {
        ...node,
        nodeId: node.id,
        id: node.modelType + '-' + node.id
      }
    })
    let graph = graphInstanceRef.current
    if (selectedId === preSelectedId && persistRef.current === persist) {
      // 不更新
      return
    }
    persistRef.current = persist

    function render() {
      graph.node((node) => {
        // console.log(node)
        const { modelType, depth, nodeId, org } = node
        return {
          style: {
            fill: modelType === 'asst' ? '#338DFF' : '#F2A230',
            stroke: 'transparent',
            opacity: nodeId === selectedId ? 1 : 0.66
          },
          label: (function() {
            if (modelType === 'asst') {
              if (depth === 0) return '人工协查'
              return '自动协查'
            } else {
              if (depth === 0) return '人工布控'
              return '自动布控'
            }
          })(),
          labelCfg: {
            position: 'bottom',
            style: {
              fill: 'rgba(8, 8, 26, 0.65)',
              fontSize: 13
            }
          },
          icon: {
            show: true,
            img: encodeURI('/node/'+(iconMap[org] || org)+'@2x.png'),
            width: 25,
            height: 25,
          }
        }
      })
      graph.edge((d) => {
        const { target } = d
        const { modelType } = target.getModel()
        const color = modelType === 'asst' ? '#338DFF' : '#F2A230'

        return { color }
      })

      graph.data(treeData)
      graph.render()
      graph.fitView()
      // 放到上中
      graph.moveTo((graph.getWidth() - graph.getGroup().getCanvasBBox().width) / 2, 40)
    }

    if (graph) {
      graph.clear()
      render()
      return
    }
    const width = graphRef.current.scrollWidth
    const height = graphRef.current.scrollHeight || 500
    graph = new G6.TreeGraph({
      container: graphRef.current,
      width,
      height,
      // linkCenter: true,
      fitViewPadding: [40, 0, 20, 0],
      renderer: 'canvas',
      modes: {
        default: [
          'drag-canvas',
          'zoom-canvas',
          {
            type: 'tooltip',
            formatText: function formatText(model) {
              return model.queryInfo
            },
            offset: 0
          }
        ]
      },
      defaultNode: {
        type: 'circle',
        size: 40,
        selectedId
      },
      defaultEdge: {
        size: 1,
        selectedId
      },
      layout: {
        type: 'dendrogram',
        direction: 'LR',
        nodeSep: 40,
        rankSep: 80,
        radial: true,
      }
    })

    graph.on('node:click', (e) => {
      const { nodeId, modelType } = e.item.getModel()
      if (modelType === 'asst') {
        router.push(`/boostshare/case/list/result/${nodeId}`)
      } else {
        router.push(`/boostshare/act/list/result/${nodeId}`)
      }
    })
    render()
    graphInstanceRef.current = graph
  }, [data, preSelectedId, selectedId, shouldRender])

  return <div ref={graphRef} className={cls(styles.graph, className)}></div>
}

export default FlowTree
