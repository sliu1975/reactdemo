import { useState, useEffect, useCallback, useRef } from 'react'
import usePersistFn from './usePersistFn'
import useMountEffect from './useMountEffect'
import useUpdateEffect from './useUpdateEffect'

class Fetch {
  service = null

  config = {
    pollingInterval: null,
    onSuccess: null,
    onError: null
  }

  state = {
    params: {},
    loading: false,
    data: undefined,
    error: undefined,
    run: this.run.bind(this),
    refresh: this.refresh.bind(this),
    cancel: this.cancel.bind(this),
    reset: this.reset.bind(this),
    unmount: this.unmount.bind(this)
  }

  count = 0

  subscribe = null

  pollingTimer = null

  constructor(service, config, subscribe) {
    this.service = service
    this.config = config
    this.subscribe = subscribe
  }

  setState(state) {
    this.state = {
      ...this.state,
      ...state
    }
    this.subscribe(this.state)
  }

  async run(params) {
    // 请求开始
    this.setState({
      loading: true,
      params
    })

    // 处理时序
    this.count += 1
    const count = this.count

    // 重置轮询定时器
    if (this.pollingTimer) clearTimeout(this.pollingTimer)
    const { pollingInterval, onSuccess, onError } = this.config

    const servicePromise = this.service(params)
    // 判断是否需要请求
    if (!servicePromise) {
      this.setState({
        loading: false
      })
      return
    }
    const result = await servicePromise
    if (count !== this.count) return new Error('请求过期')
    if (result instanceof Error) {
      this.setState({
        loading: false,
        error: result
      })
      onError && onError(result, params)
    } else {
      this.setState({
        loading: false,
        error: undefined,
        data: result
      })
      onSuccess && onSuccess(result, params)
    }
    // 开始下一个轮询
    if (pollingInterval) {
      this.pollingTimer = setTimeout(() => {
        this.refresh()
      }, pollingInterval)
    }
    return result
  }

  refresh() {
    return this.run(this.state.params)
  }

  // 重置
  reset() {
    this.count += 1
    this.setState({
      loading: false,
      data: undefined,
      error: undefined
    })
  }

  // 接口取消请求
  cancel() {
    this.count += 1
    this.setState({
      loading: false
    })
  }

  // 组件卸载
  unmount() {
    this.count += 1
    this.setState({
      loading: false
    })
    if(this.pollingTimer){
      clearTimeout((this.pollingTimer))
    }
  }
}

/**
 * 适用于两种接口请求方式
 * 1、数据展示（列表、表单、下拉数据）reactive/declarative
 * 2、按钮触发（新增、编辑、删除、搜索）imperative
 * @param {function} service
 * @param {array} deps
 * @param {*} options
 */
function useRequest(service, deps, options) {
  const _deps = Array.isArray(deps) ? deps : []
  const _options = typeof deps === 'object' && !Array.isArray(deps) ? deps : options || {}
  const { defaultParams = {}, manual = false, ...fetchConfig } = _options

  const fetchConfigRef = useRef(fetchConfig)

  const [fetchState, setFetchState] = useState()
  const fetchStateRef = useRef()
  useEffect(() => {
    fetchStateRef.current = fetchState
  }, [fetchState])

  const subscribe = useCallback((s) => {
    setFetchState(s)
  }, [])

  const servicePersist = usePersistFn(service)
  // imperative式调用请求
  const run = useCallback(
    (params) => {
      let fetchStateCurrent = fetchStateRef.current
      if (!fetchStateCurrent) {
        const fetch = new Fetch(servicePersist, fetchConfigRef.current, subscribe)
        fetchStateCurrent = fetch.state
        setFetchState(fetch.state)
      }
      return fetchStateCurrent.run(params)
    },
    [servicePersist, subscribe]
  )

  // 组件加载自动请求一次数据
  useMountEffect(() => {
    if (!manual) {
      run(defaultParams)
    }
  })

  useUpdateEffect(() => {
    if (!manual) {
      fetchStateRef.current && fetchStateRef.current.refresh()
    }
  }, [..._deps])

  // 卸载时去除副作用
  useEffect(() => {
    return () => {
      fetchStateRef.current && fetchStateRef.current.unmount()
    }
  }, [])

  return {
    loading: !manual, // 不是手动请求时 默认设置laoding为true
    data: undefined,
    error: undefined,
    ...fetchState,
    request: run
  }
}

export default useRequest
