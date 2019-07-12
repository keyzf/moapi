import { Menu ,Button,Icon,Modal,message} from 'antd';
import React from 'react';
import {inject, observer} from 'mobx-react';
import Style from './ModuleMenu.less'
import {toJS} from 'mobx';
import AddModuleModal from './AddModuleModal';
import EditModuleModal from './EditModuleModal';
import {withRouter} from "react-router-dom";

@inject("project",'interfases')
@observer
class MoudleMenu extends React.Component {
  state = {

    addModuleModalShow:false,
    editModuleModalShow:false,
    editModuleInfo:{}
  }




  openAddModuleModal=()=>{
    if(this.props.interfases.editable){
      if(!window.confirm("当前接口未保存,确定新增?")){
        return;
      }
    }
    this.setState({addModuleModalShow:true})
  }
  closeAddModuleModal=()=>{
    this.setState({addModuleModalShow:false})
  }


  openEditModuleModal=(module)=>{
    this.setState({editModuleModalShow:true,editModuleInfo:module})
  }
  closeEditModuleModal=()=>{
    this.setState({editModuleModalShow:false})
  }

  handleModuleEdit=(module,e)=>{
    e.preventDefault();
    this.openEditModuleModal(toJS(module))
  }

  handleModuleDelete=(moduleId,e)=>{
    e.preventDefault();

    Modal.confirm({
      title: '删除提醒',
      content: '确认要删除模块?',
      onOk:()=>{
        this.props.project.deleteModule(moduleId)
      }
    });
  }

  handleAddModuleModalOk=(info)=>{
    info.projectId=this.props.project.projectId;
    this.props.project.addModule(info).then((data)=>{
      message.success('添加成功')
      this.props.history.push({
        pathname: `/project/${this.props.project.projectId}`,
        search:`?moduleId=${data.id}`
      })
    });;
  }

  handleEditModuleModalOk=(info)=>{
    this.props.project.updateModule(this.state.editModuleInfo.id,info).then(()=>{
      message.success('编辑成功')
    });
  }



  handleMenuClick = (e) => {
    let search=`?moduleId=${e.item.props.module.id}`
    this.props.history.push({
      pathname: `/project/${this.props.project.projectId}`,
      search
    })
    if(this.props.location.search!==search){
      let module=e.item.props.module;
      this.props.project.selectInterfase(module.id)
    }
  }
  render() {
    return (
      <div className={Style.wrapper}>
        <AddModuleModal  onClose={this.closeAddModuleModal} onOk={this.handleAddModuleModalOk} visible={this.state.addModuleModalShow}></AddModuleModal>
        <EditModuleModal module={this.state.editModuleInfo}  onClose={this.closeEditModuleModal} onOk={this.handleEditModuleModalOk} visible={this.state.editModuleModalShow}></EditModuleModal>
        <Menu
          onClick={this.handleMenuClick}
          selectedKeys={[this.props.project.moduleId+'']}
          mode="horizontal"
        >
          {
            this.props.project.inVersionModules.map(item=>{
              return (
                <Menu.Item key={item.id} module={item}>
                      {item.name}&nbsp;
                      {this.props.project.permission>2&&<span className={Style.icon}>
                        <Icon interfase={item} onClick={this.handleModuleEdit.bind(this,item)}  type="form" />
                        <Icon interfase={item} onClick={this.handleModuleDelete.bind(this,item.id)}  type="delete" />
                      </span>}
                </Menu.Item>
              )
            })
          }

          {
            this.props.project.modules.length===0&&<Menu.Item key="demo" >空</Menu.Item>
          }


        </Menu>
        {this.props.project.permission>2&&!this.props.project.curVersion&&<Button onClick={this.openAddModuleModal} className={Style.addBtn}><Icon type="plus-circle-o" />新增模块</Button>}
      </div>
    );
  }
}

export default withRouter(MoudleMenu)
