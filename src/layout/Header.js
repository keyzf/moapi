import { Menu,Dropdown} from 'antd';
import React  from 'react';
import { Link  } from 'react-router-dom'
import Style from './Header.less'
import {inject, observer} from 'mobx-react';
import {withRouter} from "react-router-dom";

@inject("user")
@observer
class Header extends React.Component{

handleLogout=()=>{
  this.props.user.cleanUserInfo();
  this.props.history.push("/login")
}
userMenu = (
    <Menu>
      <Menu.Item>
        <Link to="/project" >个人中心</Link>
      </Menu.Item>
      <Menu.Item>
        <span onClick={this.handleLogout}>退出</span>
      </Menu.Item>
    </Menu>
  )

com

  render(){
    return (
      <div className={Style.wrapper}>
        <div className={Style.logo}/>
        <div className={Style.menu}>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[this.props.history.location.pathname]} >
            <Menu.Item key="/home"><Link to="/home" >首页</Link></Menu.Item>
            <Menu.Item key="/project"><Link to="/project" >仓库</Link></Menu.Item>
            <Menu.Item key="/course"><Link to="/course" >教程</Link></Menu.Item>
          </Menu>
        </div>
        <div className={Style.user} >
          <Dropdown overlay={this.userMenu}>
            <span >
              {this.props.user.userInfo.name}
            </span>
          </Dropdown>
        </div>

      </div>

    )
  }
}



export default withRouter(Header)
