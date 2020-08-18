import router from 'umi/router'
import { message } from 'antd'
import qs from 'qs'
import { fetchToken, removeToken } from '@/common/token'

class ResponseError extends Error {
  constructor(text, type, response, data) {
    super(text)
    this.type = type
    this.response = response
    this.data = data
  }
}

function isIE() {
  if (!!window.ActiveXObject || 'ActiveXObject' in window) {
    return true
  } else {
    return false
  }
}

// Response Code
const CODE = {
  TIMEOUT: -1, // 超时
  STATUS: -2, // http状态
  SUCCESS: 0, // 请求成功
  ERROR: 10086, // 业务相关错误
  TOKEN_INVALID: 5001, // token失效 账号禁用 账号注销
  ICON_HASCHOSEN: 7006 //icon已经在使用中，不可删除
}

class customFetch {
  constructor(url, options, interceptor) {
    this.url = url
    this.options = options
    this.responseType = ''
    this.requestInterceptors = interceptor.requestInterceptors
    this.responseInterceptors = interceptor.responseInterceptors

    return this.doFetch()
  }

  doFetch() {
    this.performRequestInterceptors()

    const requestPromise = fetch(this.url, this.options)

    const instance = Promise.race([requestPromise, this.sleep(this.options.timeout)])
      .then(this.checkStatus)
      .then(this.parseResponse)
      .then(this.businessHandler)
      .catch(this.errorHandler)
      .finally(this.performResponseInterceptors)

    return instance
  }

  // 请求超时函数
  sleep(timeout) {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new ResponseError('请求超时', CODE.TIMEOUT))
      }, timeout)
    })
  }

  // 检测状态码
  checkStatus(response) {
    if ((response.status >= 200 && response.status < 300) || response.status === 304) {
      return response
    }

    throw new ResponseError(response.statusText, CODE.STATUS, response)
  }

  // 根据Content-Type处理数据
  parseResponse = (response) => {
    const ContentType = response.headers.get('Content-Type')
    if (ContentType.includes('application/json')) {
      this.responseType = 'json'
      return response.json()
    } else if (ContentType.includes('text/plain')) {
      this.responseType = 'text'
      return response.text()
    }
    this.responseType = 'other'
    return response.blob()
  }

  // 业务逻辑处理
  businessHandler = (data) => {
    // 检测是否是JSON格式的数据
    if (this.responseType !== 'json') {
      return data
    }

    switch (data.code) {
      case CODE.SUCCESS:
        return data.data
      case CODE.TOKEN_INVALID:
        removeToken()
        // 回登录页面再清空store数据
        router.replace('/user/login')
        window.g_app._store.dispatch({
          type: 'USER_LOGOUT'
        })
        throw new ResponseError(data.message, CODE.ERROR, null, data)
      case CODE.ICON_HASCHOSEN:
        throw new ResponseError(data.message, CODE.WARNING, null, data)
      default:
        throw new ResponseError(data.message, CODE.ERROR, null, data)
    }
  }

  // 错误处理
  errorHandler = (e) => {
    // 不抛异常
    if (!this.options.throw) return e

    if (e.type === CODE.ERROR) {
      if (e && e.data && e.data.message) {
        message.error(e.data.message)
      }
    } else if (e.type === CODE.WARNING) {
      // message.warning(e.data.message)
    } else if ('stack' in e && 'message' in e) {
      // if (e?.response?.status === 500) {
      //   // 跳转500
      //   router.push('/500')
      //   return e
      // }
      // message.error(`请求错误: ${e.message}`)
    }
    return e
  }

  performRequestInterceptors() {
    if (this.options.enableInterceptors) {
      this.requestInterceptors.forEach((cb) => cb())
    }
  }

  performResponseInterceptors = () => {
    if (this.options.enableInterceptors) {
      this.responseInterceptors.forEach((cb) => cb())
    }
  }
}

function parseOption(defaultOptions, options) {
  // 处理header
  options.headers = { ...defaultOptions.headers, ...options.headers, 'access-token': fetchToken() }
  options = { ...defaultOptions, ...options }
  options.method = options.method.toUpperCase()

  if (['POST', 'PUT'].includes(options.method)) {
    switch (options.type) {
      case 'JSON':
        options.body = JSON.stringify(options.body)
        options.headers['Content-Type'] = 'application/json; charset=utf-8'
        break
      case 'FILE':
        break
      default:
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8'
        options.body = qs.stringify(options.body)
        break
    }
  }

  return options
}

function parseUrl(url, options) {
  if (options.method === 'GET') {
    // GET请求时 IE或GET无参数 都有强缓存 使用时间戳处理
    if (isIE() || !url.includes('?')) {
      if (url.includes('?')) {
        url += `&t=${Date.now()}`
      } else {
        url += `?t=${Date.now()}`
      }
    }
  }
  return url
}

function request(defaultOptions = {}) {
  const requestInterceptors = []
  const responseInterceptors = []

  /**
   * Requests a URL, returning a promise.
   *
   * @param {String} url 请求路径
   * @param {Object} [options] The options we want to pass to "fetch"
   * @param {String} [options.method] 请求方式get、post、put、delete
   * @param {String} [options.type] 请求类型JSON、FILE
   * @param {Object} [options.body] 请求体
   * @param {Object} [options.headers] 请求头
   * @param {Boolean} [options.throw] 是否抛出异常
   * @param {Boolean} [options.enableInterceptors] 是否开启拦截器
   * @param {Number} [options.timeout] 超时时间
   * @return {Promise} An object containing either "data" or "error"
   */
  const instance = (url, options = {}) => {
    // 处理options
    options = parseOption(defaultOptions, options)
    // 处理url
    url = parseUrl(url, options)

    const interceptor = {
      requestInterceptors,
      responseInterceptors
    }
    return new customFetch(url, options, interceptor)
  }

  const methods = ['get', 'post', 'delete', 'put']
  methods.forEach((method) => {
    instance[method] = (url, options) => instance(url, { ...options, method })
  })

  instance.interceptors = {
    request: (interceptor) => {
      requestInterceptors.push(interceptor)
    },
    response: (interceptor) => {
      responseInterceptors.push(interceptor)
    }
  }

  return instance
}

// 支持自定义扩展默认请求配置
export const extend = (options) => request(options)

// 默认的请求配置
export default request({
  credentials: 'include',
  method: 'get',
  throw: true,
  enableInterceptors: true,
  timeout: 30000
})
