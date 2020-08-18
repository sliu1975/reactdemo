import React, { Component } from 'react'
import styles from './Table.less'
import { Table as AntdTable } from 'antd'
import cls from 'classnames'

class Table extends Component {

  state = {
    pageNo: 1, // currentPage
    pageSize: this.props.pageSize || 10, //

    list: void 0,
    totalCount: 0,

    loading: false,
  }

  componentDidMount() {
    this.getList()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.params !== this.props.params) {
      this.getList()
    }
  }

  getList = async () => {
    const { isAll, params, hook, request, onRequest = () => void 0 } = this.props
    if (!request) {
      return
    }
    const { pageNo, pageSize } = this.state
    this.setState({loading: true})
    let data = await request({...params, pageNo, pageSize })
    if (data instanceof Error) return

    if (hook) {
      if (isAll) {
        if (Array.isArray(data)) {
          data = data.map(hook)
        }
      } else if (Array.isArray(data.list)) {
        data.list = data.list.map(hook)
      }
    }

    if (isAll) {
      this.setState({ loading: false, list: data, pageNo: 1, totalCount: data?.length || 0 })
      onRequest({totalCount: data?.length || 0})
    } else {
      this.setState({ ...data, loading: false, pageNo: data.currentPage })
      onRequest({...data})
    }

  }

  render() {
    // console.log('table render')
    // todo debounce
    let {
      singleton, isAll, params, request, pageSize: defaultPageSize,
      columns = [], className, onChange, rowKey='id', scroll, ...rest
    } = this.props
    const { list, totalCount, pageNo, pageSize, loading } = this.state
    if (singleton) {
      rest.showHeader = false
    }

    let paginationProps
    if (request) {
      paginationProps = {
        total: totalCount,
        current: pageNo,
        pageSize: pageSize,

        onChange: (pageNo, pageSize) => {
          if (isAll) {
            this.setState({ pageNo, pageSize })
          } else {
            this.setState({ pageNo, pageSize }, this.getList)
          }
        },
        onShowSizeChange: (pageNo, pageSize) => {
          if (isAll) {
            this.setState({ pageNo, pageSize })
          } else {
            this.setState({ pageNo, pageSize }, this.getList)
          }
        }
      }
    }
    // console.log('render table', params)

    let fixed = false
    columns.forEach((item) => {

      if (item.dataIndex === void 0 && item.title) {
        item.dataIndex = item.title
      }

      if (item.key === void 0) {
        item.key = item.dataIndex
      }

      if (!singleton && item.ellipsis === void 0 && !this.props.scroll) {
        item.ellipsis = true
      }

      if (item.fixed) {
        fixed = true
      }
    })

    if (fixed && !scroll) {
      scroll = {x: true}
    }

    return (
      <AntdTable
        className={cls(styles.table, singleton && styles.singleton, className)}
        tableLayout="fixed"
        columns={columns}
        dataSource={list}
        pagination={paginationProps}
        loading={loading}
        rowKey={rowKey}
        scroll={scroll}
        {...rest} />
    )
  }
}

export default Table
