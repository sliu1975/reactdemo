import { stringify } from 'qs'
import pathToRegexp from 'path-to-regexp'
import request from '@/utils/request'
import api from './api'

const apiPrefix = '/v1/'

const gen = (params) => {
  let url = apiPrefix + params
  let method = 'GET'

  const paramsArray = params.split(/\s+/)
  if (paramsArray.length > 1) {
    method = paramsArray[0]
    url = apiPrefix + paramsArray[1]
  }

  method = method.toLowerCase()

  return function (data, query, myOptions) {
    let uri = url
    if (data) {
      uri = pathToRegexp.compile(url)(data)
    }
    const options = { // method: string, type: JSON|FILE, body: object, headers: object, throw: bool, enableInterceptors: bool, timeout: number, response: bool
      method,
    }
    if (myOptions && typeof myOptions === 'object') {
      Object.assign(options, myOptions)
    }
    if (method === 'get' && data) {
      uri = `${uri}?${stringify(data)}`
    } else if (method === 'post') {
      options.type = 'JSON'
      options.body = data

      if (query && typeof query === 'object') {
        uri = `${uri}?${stringify(query)}`
      }
    }
    return request(uri, options)
  }
}

const Instance = {}
for(let key in api) {
  Instance[key] = gen(api[key])
}

export default Instance
