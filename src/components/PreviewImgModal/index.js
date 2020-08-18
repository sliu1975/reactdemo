import React from 'react'
import { Modal } from 'antd'

// 图片预览
const PreviewImgModal = (props) => {
  const { visible, onClose, url } = props
  return (
    <Modal width={480} centered visible={visible} footer={null} onCancel={onClose}>
      {url && <img alt="logo" style={{ width: '100%' }} src={url} />}
    </Modal>
  )
}

export default PreviewImgModal
