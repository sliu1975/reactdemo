import React from 'react'
import classNames from 'classnames'
import { Modal } from 'antd'
import styles from './index.less'

const FormModal = (props) => (
  <Modal {...props} className={classNames(styles.modal, props.className)}></Modal>
)

export default FormModal
