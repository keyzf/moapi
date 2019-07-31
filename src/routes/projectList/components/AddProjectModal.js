import { Modal, Form, Input, Select, Switch, Radio } from 'antd'
import React from 'react'
import { inject, observer } from 'mobx-react'
import config from '../../../config'
const FormItem = Form.Item
const TextArea = Input.TextArea
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 }
  }
}

@inject('user')
@observer
class AddProjectModal extends React.Component {
  state = {
    userList: []
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.visible !== this.props.visible) {
    }
  }

  handleOk = e => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return
      }
      this.props.onOk(values)
      this.props.form.resetFields()
      this.props.onClose()
    })
  }
  handleCancel = e => {
    this.props.form.resetFields()
    this.props.onClose()
  }

  handleSelectChange = e => {
    console.log(e)
    //this.props.form.getFieldValue()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Modal
          maskClosable={false}
          width={640}
          title="添加项目"
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '必填'
                  }
                ]
              })(<Input />)}
            </FormItem>

            {!this.props.form.getFieldValue('public') && (
              <div>
                <FormItem {...formItemLayout} label="开发者">
                  {getFieldDecorator('developers', {
                    initialValue: []
                  })(
                    <Select
                      showSearch
                      onChange={this.handleSelectChange}
                      mode="multiple"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {this.props.user.userList.map(user => (
                        <Option key={user.id} value={user.id}>
                          {user.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="使用者">
                  {getFieldDecorator('reporters', {
                    initialValue: []
                  })(
                    <Select
                      showSearch
                      onChange={this.handleSelectChange}
                      mode="multiple"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {this.props.user.userList.map(user => (
                        <Option key={user.id} value={user.id}>
                          {user.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="游客">
                  {getFieldDecorator('guests', {
                    initialValue: []
                  })(
                    <Select
                      showSearch
                      onChange={this.handleSelectChange}
                      mode="multiple"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {this.props.user.userList.map(user => (
                        <Option key={user.id} value={user.id}>
                          {user.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </div>
            )}

            <FormItem {...formItemLayout} label="公开">
              {getFieldDecorator('public', {
                initialValue: true,
                valuePropName: 'checked'
              })(<Switch />)}
            </FormItem>

            <FormItem {...formItemLayout} label="全局mock">
              {getFieldDecorator('mockType', {
                initialValue: 1
              })(
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value={1}>默认</Radio.Button>
                  <Radio.Button value={0}>全局关闭</Radio.Button>
                  <Radio.Button value={2}>全局开启</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="代理地址">
              {getFieldDecorator('proxy', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '必填'
                  }
                ]
              })(<Input />)}
            </FormItem>

            <FormItem {...formItemLayout} label="简介">
              {getFieldDecorator('description', {
                initialValue: ''
              })(<TextArea />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(AddProjectModal)
