import useRequest from './useRequest'
import useUpdateEffect from './useUpdateEffect'
import usePersistFn from './usePersistFn'

const useFormTable = (service, deps, options) => {
  const _deps = Array.isArray(deps) ? deps : []
  const _options = typeof deps === 'object' && !Array.isArray(deps) ? deps : options || {}

  const {
    data,
    loading,
    request: _request,
    refresh: _refresh,
    params,
    ...requestResult
  } = useRequest(service, {
    ..._options,
    defaultParams: {
      pageNo: 1,
      pageSize: 10,
      ..._options.defaultParams
    }
  })
  const { pageNo: pageNoFromParams = 1, pageSize = 10 } = params || {}
  // 后端返回真正的pageNo
  const pageNo = data?.currentPage || pageNoFromParams

  // 分页变化
  const handleCurrentChange = (current) => {
    _request({ ...params, pageNo: current })
  }

  const handlePageSizeChange = (_, pageSize) => {
    _request({ ...params, pageNo: 1, pageSize })
  }

  // 有deps改变页面重置成第一页
  useUpdateEffect(() => {
    if (!_options.manual) {
      _request({ ...params, pageNo: 1 })
    }
  }, [..._deps])

  // 外部参数变化页面重置成第一页
  const request = usePersistFn((p) => {
    _request({
      pageSize,
      pageNo: 1,
      ...p
    })
  })

  // 刷新时 params的页码可能不准了
  const refresh = usePersistFn(() => {
    if (pageNo === pageNoFromParams) {
      _refresh()
    } else {
      _request({
        ...params,
        pageNo
      })
    }
  })

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    total: data?.totalCount || 0,
    current: pageNo,
    onChange: handleCurrentChange,
    pageSize: pageSize,
    onShowSizeChange: handlePageSizeChange
  }

  return {
    data,
    loading,
    params,
    request,
    refresh,
    ...requestResult,
    paginationProps,
    tableProps: {
      tableLayout: 'fixed',
      dataSource: data?.list || [],
      loading: loading,
      pagination: paginationProps
    }
  }
}

export default useFormTable
