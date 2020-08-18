import React from 'react'
import { Form, Input, message } from 'antd'
import FormModal from '@/components/FormModal'
// import { modifyPwd } from '@/services/sys'
import { PwdReg } from '@/common/reg'
import { useRequest } from '@/hooks'

const ModifyPwdModal = (props) => {
  const { visible, onOk, onCancel } = props

  const [form] = Form.useForm()
  // const { request, loading } = useRequest(modifyPwd, { manual: true })
  const handleSubmit = (e) => {
    e.preventDefault()
    form
      .validateFields()
      .then(async (values) => {
        // const params = { ...values }
        // const result = await request(params)
        // if (result instanceof Error) return
        message.success('密码修改成功，请重新登录')
        onOk && onOk()
        form.resetFields()
      })
      .catch(() => {})
  }

  const handleCancel = () => {
    onCancel && onCancel()
    form.resetFields()
  }

  const layout = {
    size: 'large',
    colon: false,
    hideRequiredMark: true,
    labelAlign: 'left',
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }

  return (
    <FormModal
      title="修改密码"
      width={411}
      centered
      forceRender
      maskClosable={false}
      visible={visible}
      // okButtonProps={{ loading }}
      onOk={handleSubmit}
      // cancelButtonProps={{ disabled: loading }}
      onCancel={handleCancel}
    >
      <Form form={form} {...layout}>
        <Form.Item
          label="旧密码"
          name="Pwd"
          rules={[
            {
              required: true,
              message: '请输入旧密码'
            },
            { pattern: PwdReg, message: '请输入有效密码' }
          ]}
        >
          <Input.Password placeholder="请输入" autoComplete="off"></Input.Password>
        </Form.Item>
        <Form.Item
          label="新密码"
          name="newPwd"
          dependencies={['Pwd']}
          validateFirst
          rules={[
            {
              required: true,
              message: '请输入新密码'
            },
            { pattern: PwdReg, message: '请输入有效密码' },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('Pwd') !== value) {
                  return Promise.resolve()
                }
                return Promise.reject('旧密码与新密码相同')
              }
            })
          ]}
        >
          <Input.Password placeholder="请输入" autoComplete="off"></Input.Password>
        </Form.Item>
      </Form>
    </FormModal>
  )
}

export default ModifyPwdModal
