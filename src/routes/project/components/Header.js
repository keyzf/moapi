import React from 'react'
import { Icon, Select, Modal, Button, Input, AutoComplete, Dropdown, Menu } from 'antd'
import EditProjectModal from './EditProjectModal'
import EditDocModal from './EditDocModal'
import CheckModal from './CheckModal'
import ImportSwaggerModal from './ImportSwaggerModal'
import TemplateModal from './TemplateModal'
import GatewayTemplateModal from './GatewayTemplateModal'
import { inject, observer } from 'mobx-react'
import Style from './Header.less'
import { Link } from 'react-router-dom'
import config from '@/config'
import { mergePath } from '@/utils'
import copy from 'copy-to-clipboard'
const Option = Select.Option

@inject('project', 'interfases', 'user')
@observer
class Header extends React.Component {
  state = {
    editProjectModalShow: false,
    templateModalShow: false,
    editDocModalShow: false,
    importSwaggerModalShow: false,
    gatewayTemplateModalShow: false,
    checkModalShow: false
  }
  addVersion = ''

  componentDidMount() {
    this.props.project.changeCurVersion('')
  }
  openEditProjectModal = () => {
    this.setState({ editProjectModalShow: true })
  }
  openCheckModal = () => {
    this.setState({ checkModalShow: true })
  }
  closeCheckModal = () => {
    this.setState({ checkModalShow: false })
  }
  openEditDocModal = () => {
    this.setState({ editDocModalShow: true })
  }
  openTemplateModal = () => {
    this.setState({ templateModalShow: true })
  }
  openGatewayTemplateModal = () => {
    this.setState({ gatewayTemplateModalShow: true })
  }
  closeGatewayTemplateModal = () => {
    this.setState({ gatewayTemplateModalShow: false })
  }
  closeTemplateModal = () => {
    this.setState({ templateModalShow: false })
  }
  closeEditProjectModal = () => {
    this.setState({ editProjectModalShow: false })
  }
  handleUpdateProjectOk = info => {
    this.props.project.updateProject(this.props.project.projectId, info).then(() => {
      this.props.project.getProjectInfo(this.props.project.projectId).then(data => {
        this.props.interfases.refreshCode()
      })
    })
  }
  handleUpdateTemplateOk = info => {
    this.props.project.updateProject(this.props.project.projectId, { template: info }).then(() => {
      this.props.project.getProjectInfo(this.props.project.projectId)
    })
  }
  handleUpdateGatewayTemplateOk = info => {
    this.props.project.updateProject(this.props.project.projectId, { gatewayTemplate: info }).then(() => {
      this.props.project.getProjectInfo(this.props.project.projectId).then(data => {
        this.props.interfases.refreshCode()
      })
    })
  }
  handleCheckOk = info => {
    this.props.project.updateProject(this.props.project.projectId, { checkInfo: info }).then(() => {
      this.props.project.getProjectInfo(this.props.project.projectId)
    })
  }

  handlerAddVersion = () => {
    this.addVersion = ''
    const ref = Modal.confirm({
      title: '添加项目版本号',
      content: (
        <Input defaultValue={this.addVersion} style={{ width: 200 }} onInput={e => (this.addVersion = e.target.value)}></Input>
      ),
      iconType: 'plus-circle',
      okText: '添加',
      cancelText: '取消',
      onOk: () => {
        ref.destroy()
        if (this.addVersion === '' || this.props.project.info.versions.includes(this.addVersion)) {
          return
        }
        this.props.project.addVersion(this.addVersion)
      }
    })
  }
  handleChangeVersion = value => {
    this.props.project.changeCurVersion(value)
  }

  handleShowMockUrl = () => {
    let path = this.props.project.mockUrl
    Modal.info({
      title: '在线mock地址',
      content: path,
      onOk: () => {
        copy(path)
      },
      okText: '复制'
    })
  }

  handleShowPostmanUrl = () => {
    let path = this.props.project.postmanUrl
    Modal.info({
      title: 'postman import link',
      content: path,
      onOk: () => {
        copy(path)
      },
      okText: '复制'
    })
  }

  handleShowSearch = () => {
    const dataSource = this.props.project.data.modules.reduce((total, item) => {
      return total.concat(item.interfases.slice())
    }, [])
    let data = null
    Modal.info({
      title: '查找接口',
      content: (
        <Select
          showSearch
          style={{ width: 300 }}
          placeholder="请输入url或者接口名称"
          onChange={(e, option) => (data = option)}
          filterOption={(input, option) => {
            return (
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
            )
          }}
        >
          {dataSource.map(item => (
            <Option moduleid={item.moduleId} interfaseid={item.id} key={item.id} value={item.url + item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      ),
      iconType: 'search',
      onOk: () => {
        if (data) {
          this.props.project.selectInterfase(data.props.moduleid, data.props.interfaseid)
          data = null
        }
      },
      okText: '查找'
    })
  }

  handleUpdateDocOk = data => {
    this.props.project.updateProject(this.props.project.projectId, { docMenu: data }).then(() => {
      this.props.project.getProjectInfo(this.props.project.projectId)
    })
  }

  closeEditDocModal = () => {
    this.setState({ editDocModalShow: false })
  }

  openImportSwaggerModal = () => {
    this.setState({ importSwaggerModalShow: true })
  }

  handleImportSwaggerOk = info => {
    this.closeImportSwaggerModal()
  }
  closeImportSwaggerModal = () => {
    this.setState({ importSwaggerModalShow: false })
  }

  render() {
    const menu = (
      <Menu>
        <Menu.Item>
          <a download href={this.props.project.mdDownloadUrl}>
            <Icon type="file-markdown" />
            下载文档
          </a>
        </Menu.Item>
        <Menu.Item>
          <a download href={this.props.project.serverUrl}>
            <Icon type="cloud-download-o" />
            生成server
          </a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={this.handleShowMockUrl}>
            <Icon type="link" />
            mock地址
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            href={`${config.baseURL}project/export/${this.props.project.info.id}?token=${this.props.user.userInfo.accessToken}`}
            download={this.props.project.name + '.json'}
          >
            <Icon type="file-markdown" />
            导出
          </a>
        </Menu.Item>
      </Menu>
    )

    return (
      <div className={Style.wrapper}>
        <CheckModal onOk={this.handleCheckOk} onClose={this.closeCheckModal} visible={this.state.checkModalShow}></CheckModal>
        <EditProjectModal
          onOk={this.handleUpdateProjectOk}
          onClose={this.closeEditProjectModal}
          visible={this.state.editProjectModalShow}
        ></EditProjectModal>
        <EditDocModal
          onOk={this.handleUpdateDocOk}
          onClose={this.closeEditDocModal}
          visible={this.state.editDocModalShow}
        ></EditDocModal>
        <TemplateModal
          onOk={this.handleUpdateTemplateOk}
          onClose={this.closeTemplateModal}
          visible={this.state.templateModalShow}
        ></TemplateModal>

        <GatewayTemplateModal
          onOk={this.handleUpdateGatewayTemplateOk}
          onClose={this.closeGatewayTemplateModal}
          visible={this.state.gatewayTemplateModalShow}
        ></GatewayTemplateModal>

        <ImportSwaggerModal
          onOk={this.handleImportSwaggerOk}
          onClose={this.closeImportSwaggerModal}
          visible={this.state.importSwaggerModalShow}
        ></ImportSwaggerModal>
        <div className={Style.title}>
          <h1>
            <Link to="/project">{this.props.project.info.admin.name}</Link>
            <span>/</span>
            {this.props.project.info.name}
          </h1>
        </div>

        <div className={Style.operation}>
          {this.props.project.permission > 1 && (
            <a onClick={this.openEditProjectModal} href="###">
              <Icon type="setting" />
              编辑
            </a>
          )}

          {this.props.project.permission > 2 && (
            <a onClick={this.openTemplateModal} href="###">
              <Icon type="appstore-o" />
              初始模板
            </a>
          )}

          {this.props.project.permission > 2 && (
            <a onClick={this.openGatewayTemplateModal} href="###">
              <Icon type="appstore-o" />
              网关格式
            </a>
          )}

          {this.props.project.permission > 1 && (
            <a onClick={this.openCheckModal} href="###">
              <Icon type="appstore-o" />
              鉴权
            </a>
          )}

          <a target="_blank" href={this.props.project.docUrl}>
            <Icon type="file-text" />
            在线文档
          </a>

          <a onClick={this.openEditDocModal}>
            <Icon type="file-markdown" />
            附件管理
          </a>

          {this.props.project.permission > 2 && (
            <a onClick={this.openImportSwaggerModal}>
              <Icon type="file-markdown" />
              导入swagger
            </a>
          )}

          <a onClick={this.handleShowPostmanUrl}>
            <Icon type="link" />
            导出postman
          </a>

          <a onClick={this.handleShowSearch}>
            <Icon type="search" />
            查找接口
          </a>

          <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" href="#">
              更多
              <Icon type="down" />
            </a>
          </Dropdown>
        </div>

        <div style={{ float: 'right' }}>
          <Select style={{ minWidth: 100 }} value={this.props.project.curVersion} onChange={this.handleChangeVersion}>
            <Option value="">所有版本</Option>
            {this.props.project.info.versions
              .slice()
              .reverse()
              .map(version => (
                <Option key={version} value={version}>
                  {version}
                </Option>
              ))}
          </Select>
          {this.props.project.permission > 2 && <Button onClick={this.handlerAddVersion}>添加版本</Button>}
        </div>
      </div>
    )
  }
}

export default Header
