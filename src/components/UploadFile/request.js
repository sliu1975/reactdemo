import { message } from 'antd'
import router from 'umi/router'
import { fetchToken, removeToken } from '@/common/token'

// Response Code
const CODE = {
  TIMEOUT: -1, // 超时
  STATUS: -2, // http状态
  SUCCESS: 0, // 请求成功
  ERROR: 10086, // 业务相关错误
  TOKEN_INVALID: 8001, // token失效
  ACCOUNT_LOCK: 8006, // 账号禁用
  ACCOUNT_NOT_EXIST: 8002 // 账号注销
}

/**
 * 上传文件服务
 */
export default class OSS {
  constructor(url) {
    this.url = url
    this.xhrs = new Map()
  }

  send(file, onSuccess, onError, onProgress, folder) {
    const { uid } = file
    const formData = new FormData()
    if (!(file instanceof File)) {
      let fileOfBlob = new File([file], file.name, { type: file.type })
      formData.append('file', fileOfBlob)
    } else {
      formData.append('file', file)
    }
    if (folder) {
      formData.append('folder', folder)
    }
    const xhr = new XMLHttpRequest()
    xhr.open('POST', this.url, true)
    xhr.responseType = 'json'
    xhr.setRequestHeader('access-token', fetchToken())
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const { total, loaded } = e
        onProgress({ percent: (loaded / total) * 100 })
      }
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return
      }
      this.xhrs.delete(uid)
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
        const { code, data, message: msg } = xhr.response
        if (code === 0) {
          // 文件已上传完毕
          onSuccess(data)
        } else if (code === CODE.TOKEN_INVALID) {
          // 回登录页面再清空store数据
          router.replace('/user/login')
          window.g_app._store.dispatch({
            type: 'USER_LOGOUT'
          })
          message.error('登录过期，请重新登录')
        } else if (code === CODE.ACCOUNT_LOCK || code === CODE.ACCOUNT_NOT_EXIST) {
          removeToken()
          // 回登录页面再清空store数据
          router.replace('/user/login')
          window.g_app._store.dispatch({
            type: 'USER_LOGOUT'
          })
          message.error(msg)
        } else {
          message.error(msg)
          onError(new Error(msg))
        }
      } else if (xhr.status !== 0) {
        message.error('请求错误: ' + xhr.statusText)
        onError(new Error(xhr.statusText))
      } else {
        // 0是abort
        onError(new Error(xhr.statusText))
      }
    }
    xhr.send(formData)
    this.xhrs.set(uid, xhr)
  }

  cancel(uids) {
    if (uids && typeof uids === 'string') {
      uids = [uids]
    }
    this.xhrs.forEach((xhr, uid) => {
      if (typeof uids === 'undefined' || uids.includes(uid)) {
        xhr.abort()
      }
    })
  }
}
