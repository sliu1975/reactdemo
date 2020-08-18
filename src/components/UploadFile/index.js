import React, { Component } from 'react'
import { Upload, Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
import OSS from './request'
import styles from './index.less'

export const FileNameReg = /^([0-9]|[a-z]|[A-Z]|[\u4e00-\u9fa5]){1,30}$/
export const HttpReg = /^https?:/
export const BASE_URL = '/v1' // 也许可以用precess.env获取
// export function parseUrl(url) {
//   if (HttpReg.test(url)) return url
//   return (BASE_URL + url).replace(/\/+/g, '/')
// }

// 文件上传组件
export default class UploadFile extends Component {
  static defaultProps = {
    accept: '*', // '.pdf,.docx'
    url: `${BASE_URL}/common/file/upload`,
    size: void 0, // 默认不限制大小
    multiple: false, // 是否多文件
    manual: false, // 是否手动上传
    listType: 'text',
    fileLimit: 5, // 文件最多上传个数上限
    prompt: '',
    onLoading: () => {}, // 文件上传中或上传结束回调
    onValidatePicSize: void 0, // 图片尺寸校验
    parseResponse: (url) => ({ url }) // 解析接口返回的response
  }

  static propTypes = {
    accept: PropTypes.string,
    url: PropTypes.string,
    size: PropTypes.number,
    multiple: PropTypes.bool,
    manual: PropTypes.bool,
    listType: PropTypes.string,
    fileLimit: PropTypes.number,
    prompt: PropTypes.string,
    onLoading: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = {
      fileList: []
    }

    this.OSS = new OSS(props.url)
  }

  componentDidMount() {
    const { fileList, onChange } = this.props
    if (fileList && fileList.length) {
      this.setState({ fileList })
      onChange(fileList)
    }
  }

  componentWillUnmount() {
    this.OSS.cancel()
  }

  // 文件上传前校验
  handleBeforeUpload = (file, fileList) => {
    const { accept, size, onValidatePicSize, validator, beforeUpload } = this.props
    return new Promise((resolve, reject) => {
      const pointIndex = file.name.lastIndexOf('.')
      const extraFile = file.name.slice(pointIndex)
      const fileName = file.name.slice(0, pointIndex)
      if (accept !== '*' && accept.split(',').indexOf(extraFile.toLowerCase()) === -1) {
        message.error(`仅允许上传类型为${accept.replace(/,/g, '、').replace(/\./g, '')}`)
        reject()
      } else if (!FileNameReg.test(fileName)) {
        message.error('文件名称过长或包含非法字符，最大长度为32字符，只允许中文、英文、数字')
        reject()
      } else if (typeof size !== 'undefined' && file.size / 1024 / 1024 > size) {
        message.error(`文件大小超过${size}M，请重新上传`)
        reject()
      } else if (typeof onValidatePicSize === 'function') {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function readerLoad(f) {
          const image = new Image()
          image.src = f.target.result
          image.onload = function imgLoad() {
            if (onValidatePicSize(this.width, this.height)) {
              resolve()
            } else {
              message.error('图片尺寸不符合')
              reject()
            }
          }
        }
      } else if (typeof validator === 'function') {
        validator(file)
          .then(resolve)
          .catch((msg) => {
            message.error(msg)
            reject()
          })
      } else if (typeof beforeUpload === 'function') {
        // imageCrop 提供的beforeUpload
        beforeUpload(file, fileList)
          .then(resolve)
          .catch((msg) => {
            message.error(msg)
            reject()
          })
      } else {
        resolve()
      }
    })
  }

  // 自定义上传
  handleCustomRequest = ({ file, onSuccess, onError, onProgress }) => {
    const { onLoading, manual, folder } = this.props
    // 手动上传不发起请求
    if (manual) return
    onLoading(true)
    this.OSS.send(file, onSuccess, onError, onProgress, folder)
  }

  // 文件信息同步至父组件
  handleChange = ({ fileList, file }) => {
    const { multiple, manual, onChange, onLoading, parseResponse } = this.props
    if (!manual) {
      // 解析response
      fileList = fileList.map((f) => ({ ...f, ...parseResponse(f.response) }))
    } else {
      fileList.forEach((f) => {
        f.status = 'done'
      })
    }

    // 是否多文件上传
    if (multiple) {
      this.setState({ fileList })
    } else {
      // 取消多余的文件上传
      this.OSS.cancel(fileList.slice(0, -1).map((v) => v.uid))
      fileList = fileList.slice(-1)
      this.setState({ fileList })
    }
    // 处理文件上传成功和错误的情况
    if (file.status === 'done' || file.status === 'error') {
      // 文件是否上传中
      onLoading(fileList.some((f) => f.status === 'uploading'))
      // 上传错误的文件不抛出去
      onChange(fileList.filter((f) => f.status === 'done'))
    } else if (file.status === 'removed') {
      this.OSS.cancel(file.uid)
      onLoading(fileList.some((f) => f.status === 'uploading'))
    }
  }

  // 文件预览
  handlePreview = () => {
    // TODO:文件和图片预览
    // if (!file.url && !file.thumbUrl) return
    // const a = document.createElement('a')
    // a.href = file.url || file.thumbUrl
    // a.target = '_blank'
    // a.rel = 'noopener noreferrer'
    // a.click()
  }

  // 删除文件
  handleRemove = (file) => {
    const { multiple, onChange } = this.props
    const { fileList } = this.state
    if (multiple) {
      // 过滤未上传成功的文件和当前正在删除的文件
      onChange(fileList.filter((f) => f.status === 'done' && f !== file))
    } else {
      onChange([])
    }
  }

  // eslint-disable-next-line
  // TODO: 删除UNSAFE 改进fileList
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { onChange, fileList } = this.props
    // 设置默认fileList
    if (fileList !== nextProps.fileList) {
      this.setState(
        {
          fileList: nextProps.fileList
        },
        () => onChange(nextProps.fileList)
      )
    }
  }

  renderUploadBtn() {
    const { listType, fileLimit, uploadButton, prompt } = this.props
    const { fileList } = this.state

    const textButton = (
      <>
        <Button>
          <PlusOutlined />
          上传文件
        </Button>
        <span style={{ paddingLeft: 19, color: '#999' }} onClick={(e) => e.stopPropagation()}>
          {prompt}
        </span>
      </>
    )
    const pictureButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">{prompt}</div>
      </div>
    )

    if (listType === 'picture-card') {
      if (fileLimit && fileList.length >= fileLimit) {
        return null
      }
      return uploadButton || pictureButton
    }
    return uploadButton || textButton
  }

  render() {
    const { accept, multiple, listType, showUploadList } = this.props
    const { fileList } = this.state
    return (
      <Upload
        className={styles.upload}
        accept={accept}
        multiple={multiple}
        fileList={fileList}
        listType={listType}
        showUploadList={showUploadList}
        beforeUpload={this.handleBeforeUpload}
        customRequest={this.handleCustomRequest}
        onChange={this.handleChange}
        onPreview={this.handlePreview}
        onRemove={this.props.handleRemove || this.handleRemove}
        // TODO：提供antd默认扩展属性
      >
        {this.renderUploadBtn()}
      </Upload>
    )
  }
}
