import React from "react";
import { Form, Icon, Input, Button, message } from 'antd';
import Style from "./LoginForm.less";
import { inject, observer } from 'mobx-react';
import {Link} from "react-router-dom";
import intl from "react-intl-universal";
import AccountLayout from './components/AccountLayout'
import config from "../../config";
const FormItem = Form.Item;

@inject("user")
@observer
class LoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.user.signin(values).then(() => {
          message.success(intl.get("login.message.signin").d("登录成功"));
          this.props.history.push("/project")
        })
      }
    });
  }
  render () {
    const { getFieldDecorator } = this.props.form;
    return (
      <AccountLayout>
      <div className={Style.wrapper}>
        <h2 className={Style.title}>用户登录</h2>
        <Form onSubmit={this.handleSubmit} className={Style.from}>
          <FormItem>
            {getFieldDecorator('phone', {
              rules: [{ required: true, message: intl.get("login.rules.phone").d("请输入手机号") }],
            })(
              <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder={intl.get("login.placeholder.phone").d("手机号")} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: intl.get("login.rules.password").d("请输入密码") }],
            })(
              <Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder={intl.get("login.placeholder.password").d("密码")} />
            )}
          </FormItem>
          <FormItem>
            <Button style={{ width: "100%" }} size="large" type="primary" htmlType="submit" className={Style.submit}>
              {intl.get("login.signin").d("登录")}
            </Button>
          </FormItem>
          <FormItem>
            <a href={`http://employee.qa.91jkys.com/sso/login?redirect=${config.baseURL}users/single-sign-on`}>
              <Button style={{ width: "100%" }} size="large" type="primary" className={Style.submit}>
                  使用内网登陆
              </Button>
            </a>
          </FormItem>
          {config.canSignup&&<FormItem>
            <Link to="/signup">没有账号?去注册 </Link>
          </FormItem>}
          

          
          
        </Form>
      </div>
      </AccountLayout>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(LoginForm);

export default WrappedNormalLoginForm;
