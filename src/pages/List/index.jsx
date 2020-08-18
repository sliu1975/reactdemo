import React from 'react'
import { Link } from 'react-router-dom'
import router from 'umi/router'
import dayjs from 'dayjs'
import { Form, Row, Col, Select, Button, Table, Tag, message } from 'antd'
import CustomSearch from '@/components/CustomSearch'
import { useRequest, useDebounceFn, useInterval } from '@/hooks'
import api from '@/services'
import { ActEnum, CompanyEnum } from '@/common/enum'

const List = () => {
  const [form] = Form.useForm()

  const { request, data = [], params, loading, refresh } = useRequest(api.actList)
  const tableProps = {
    tableLayout: 'fixed',
    dataSource: data,
    pagination: { showSizeChanger: true, showQuickJumper: true }
  }

  useInterval(() => {
    refresh()
  }, 10000)

  const handleSearch = useDebounceFn((keyword) => {
    request({ ...params, keyword })
  }, 300)

  async function saveAct(actionId, actionStatus) {
    const status = actionStatus === ActEnum.SUSPENDED ? ActEnum.RUNNING : ActEnum.SUSPENDED

    const result = await api.addAction({ actionId, actionStatus: status })
    if (result instanceof Error) return
    message.success(actionStatus === ActEnum.SUSPENDED ? '启动成功' : '暂停成功')
    refresh()
  }

  const onSubmit = useDebounceFn(() => {
    request({ ...params })
  }, 300)

  const handleActionOrgSearch = useDebounceFn((actionOrg) => {
    request({ ...params, actionOrg })
  }, 300)

  const handleStateChangeSearch = (actionStatus) => {
    request({
      ...params,
      actionStatus
    })
  }

  const layout = {
    colon: false
  }

  const columns = [
    {
      title: '布控行动编号',
      width: 100,
      dataIndex: 'actionId',
      render: (t) => (
        <Link color="rgba(51, 95, 255, 1)" to={`list/detail/${t}`}>
          {'XD' + (Array(4).join(0) + t).slice(-4)}
        </Link>
      )
    },
    {
      title: '布控行动名称',
      width: 130,
      dataIndex: 'actionName'
    },
    {
      title: '模型名称',
      width: 120,
      dataIndex: 'modelName'
    },
    {
      title: '创建日期',
      width: 100,
      dataIndex: 'createTime',
      render: (t) => dayjs(t).format('YYYY.MM.DD')
    },
    {
      title: '创建人',
      width: 90,
      dataIndex: 'createOperName'
    },
    {
      title: '布控行动状态',
      width: 90,
      dataIndex: 'actionStatus',
      render: (state) => {
        switch (state) {
          case ActEnum.RUNNING:
            return (
              <Tag color="rgba(65, 179, 54, 0.08)" style={{ color: 'rgba(65, 179, 54, 1)' }}>
                {state}
              </Tag>
            )
          case ActEnum.STOPED:
            return (
              <Tag color="rgba(22, 22, 64, 0.04)" style={{ color: 'rgba(22, 22, 64, 0.38)' }}>
                {state}
              </Tag>
            )
          case ActEnum.SUSPENDED:
            return (
              <Tag color="rgba(0, 172, 230, 0.08)" style={{ color: 'rgba(0, 172, 230, 1)' }}>
                {state}
              </Tag>
            )
          default:
            return null
        }
      }
    },
    {
      title: '布控行动机构',
      width: 200,
      dataIndex: 'actionOrg',
      render: (t) =>
        t.split(' ').map((k, index) => {
          return <div key={k}>{k}</div>
        })
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      render: (_, record) => {
        const { actionId, actionStatus } = record
        return (
          <div style={{ whiteSpace: 'nowrap' }}>
            <Button
              type="link"
              onClick={() => router.push(`/boostshare/act/list/result/${record.actionId}`)}
            >
              查看结果
            </Button>
            {/* 已回复才能查看结果 */}
            {actionStatus !== ActEnum.STOPED && (
              <Button
                type="link"
                onClick={() =>
                  router.push(
                    `/boostshare/act/list/edit?actionId=${record.actionId}&type=${record.modelName}`
                  )
                }
              >
                编辑
              </Button>
            )}
            {/* 待回复才有变更、终止 */}
            {actionStatus !== ActEnum.STOPED && (
              <Button
                type="link"
                onClick={() => {
                  saveAct(actionId, actionStatus)
                }}
              >
                {actionStatus === ActEnum.SUSPENDED ? '启动' : '暂停'}
              </Button>
            )}
          </div>
        )
      }
    }
  ]

  return (
    <div className="card">
      <Form form={form} {...layout} onFinish={onSubmit}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="关键字" name="keyword" rules={[{ required: false }]}>
              <CustomSearch
                placeholder="搜索模型名称/布控行动名称/创建人"
                onSearch={handleSearch}
              ></CustomSearch>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="选择布控行动机构" name="actionOrg" rules={[{ required: false }]}>
              <Select
                showSearch
                placeholder="选择布控行动机构"
                allowClear
                optionFilterProp="children"
                onChange={handleActionOrgSearch}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Select.Option>全部</Select.Option>
                {Object.values(CompanyEnum).map((v) => (
                  <Select.Option key={v} value={v}>
                    {v}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="选择布控行动状态" name="actionStatus" rules={[{ required: false }]}>
              <Select
                showSearch
                allowClear
                placeholder="选择布控行动状态"
                optionFilterProp="children"
                onChange={handleStateChangeSearch}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Select.Option>全部</Select.Option>
                {Object.values(ActEnum).map((v) => (
                  <Select.Option key={v} value={v}>
                    {v}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Table rowKey="actionId" columns={columns} {...tableProps} scroll={{ x: 1200 }}></Table>
      </Form>
    </div>
  )
}

export default List
