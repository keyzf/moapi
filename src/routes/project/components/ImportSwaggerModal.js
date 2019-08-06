import { Modal, Form, Input, Upload, Button, Icon, message } from 'antd'
import React from 'react'
import { inject, observer } from 'mobx-react'
import config from '@/config'
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 }
  }
}

@inject('interfases', 'user', 'project')
@observer
class ImportSwaggerModal extends React.Component {
  state = {
    confirmLoading: false
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.visible !== this.props.visible) {
      this.props.form.setFieldsValue({
        url: nextProps.project.info.swaggerUrl
      })
    }
  }

  handleAddOk = e => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return
      }
      this.setState({
        confirmLoading: true
      })
      values.increment = true //增量同步
      this.props.project
        .importSwagger(values)
        .then(data => {
          this.props.form.resetFields()
          this.props.onClose()
          this.setState({
            confirmLoading: false
          })
        })
        .catch(e => {
          message.error('同步失败')
          this.setState({
            confirmLoading: false
          })
        })
    })
  }

  handleOk = e => {
    Modal.confirm({
      title: '警告',
      content: '同步会覆盖原有的接口!确定要覆盖?',
      onOk: () => {
        this.props.form.validateFields((err, values) => {
          if (err) {
            return
          }
          this.setState({
            confirmLoading: true
          })
          this.props.project
            .importSwagger(values)
            .then(data => {
              this.props.form.resetFields()
              this.props.onClose()
              this.setState({
                confirmLoading: false
              })
            })
            .catch(e => {
              message.error('同步失败')
              this.setState({
                confirmLoading: false
              })
            })
        })
      }
    })
  }
  handleCancel = e => {
    this.props.form.resetFields()
    this.props.onClose()
  }

  handleChange = ({ file }) => {
    if (file.status === 'done') {
      message.success('上传成功')
      this.props.form.setFieldsValue({
        url: file.response.result.fullPath
      })
    }
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return
      }
      this.props.project
        .updateProject(this.props.project.projectId, { swaggerUrl: values.url })
        .then(() => {
          this.props.project.getProjectInfo(this.props.project.projectId)
          this.props.onClose()
        })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Modal
          maskClosable={false}
          width={640}
          title={
            <div>
              导入Swagger<small>(仅管理员可以同步)</small>
            </div>
          }
          onCancel={this.handleCancel}
          visible={this.props.visible}
          footer={
            <div>
              <Button onClick={this.handleCancel}>取消</Button>
              {this.props.project.permission > 3 && (
                <Button
                  loading={this.state.confirmLoading}
                  type="primary"
                  onClick={this.handleOk}
                >
                  全局同步
                </Button>
              )}
              {this.props.project.permission > 2 && (
                <Button
                  loading={this.state.confirmLoading}
                  type="primary"
                  onClick={this.handleAddOk}
                >
                  增量同步
                </Button>
              )}
              <Button type="primary" onClick={this.handleSubmit}>
                提交
              </Button>
            </div>
          }
        >
          <Form>
            <FormItem {...formItemLayout} label="在线swagger">
              {getFieldDecorator('url', {
                initialValue: ''
              })(<Input />)}
            </FormItem>

            <FormItem {...formItemLayout} label="本地swagger文件">
              {getFieldDecorator('message', {
                initialValue: ''
              })(
                <Upload
                  showUploadList={false}
                  onChange={this.handleChange}
                  action={`${config.baseURL}common/file/upload`}
                >
                  <Button>
                    <Icon type="upload" /> 上传
                  </Button>
                </Upload>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(ImportSwaggerModal)
