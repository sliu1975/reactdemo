import React, { useState, useRef, useEffect } from 'react'
import { Tooltip } from 'antd'

// 订阅resize事件
let listenerTag = false
const subscriber = new Set()
const applySubscriber = () => {
  subscriber.forEach((fn) => {
    fn()
  })
}

// table-layout: fixed
const Ellipsis = (props) => {
  const { children, title, overlayClassName } = props

  const ellipsisRef = useRef()
  const [isEllipsis, setIsEllipsis] = useState(false)
  const handleResize = () => {
    if (!ellipsisRef.current) return
    const ellipsisNode = ellipsisRef.current
    // 获取文本真实宽度
    const range = document.createRange()
    range.setStart(ellipsisNode, 0)
    range.setEnd(ellipsisNode, ellipsisNode.childNodes.length)
    const rangeWidth = range.getBoundingClientRect().width
    // console.log('rangeWidth' + rangeWidth)
    // console.log('offsetWidth'+ellipsisNode.offsetWidth)
    // console.log('scrollWidth'+ellipsisNode.scrollWidth)

    if (
      rangeWidth >= ellipsisNode.offsetWidth ||
      ellipsisNode.scrollWidth > ellipsisNode.offsetWidth
    ) {
      setIsEllipsis(true)
    } else {
      setIsEllipsis(false)
    }
  }

  useEffect(() => {
    handleResize()
    subscriber.add(handleResize)
    if (!listenerTag) {
      window.addEventListener('resize', applySubscriber)
      listenerTag = true
    }
    return () => {
      subscriber.delete(handleResize)
      if (!subscriber.size && listenerTag) {
        window.removeEventListener('resize', applySubscriber)
        listenerTag = false
      }
    }
  }, [])

  // 内容变化更新 可能有性能问题
  useEffect(() => {
    handleResize()
  }, [children])

  const [visible, setVisible] = useState(false)
  const handleVisibleChange = (value) => {
    // 只有省略的时候才能显示
    if (value && isEllipsis) {
      setVisible(true)
      return
    }
    setVisible(false)
  }

  return (
    <Tooltip title={title || children} visible={visible} onVisibleChange={handleVisibleChange} overlayClassName={overlayClassName}>
      <div
        ref={ellipsisRef}
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {children}
      </div>
    </Tooltip>
  )
}

export default Ellipsis
