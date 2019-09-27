import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './index.less';
import { Form, Input, Button, notification } from 'antd';
import { setItem } from '@/common/js/util';

class Login extends Component {
  state = {
    confirmDirty: false,
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        this.openNotification('error');
        return false;
      }

      setItem('qxkz_info', values);
      this.props.history.push('/user');
    });
  };

  openNotification = type => {
    notification[type]({
      message: '提示',
      description: '请输入必填项！',
      duration: null,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="login-wrap">
        <Form onSubmit={this.handleSubmit} layout="inline" colon={false} className="login-form">
          <Form.Item label="用户名">
            {getFieldDecorator('name', {
              initialValue: 'zwadmin',
              rules: [
                {
                  required: true,
                  message: '请输入用户名!',
                  trigger: 'onBlur',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="密码">
            {getFieldDecorator('password', {
              initialValue: '85896092',
              rules: [
                {
                  required: true,
                  message: '请输入密码!',
                  trigger: 'onBlur',
                },
              ],
            })(<Input type="password" autoComplete="off" />)}
          </Form.Item>
          <Form.Item label="验证码">
            {getFieldDecorator('verify', {
              initialValue: '6666',
              rules: [
                {
                  required: true,
                  message: '请输入验证码!',
                  trigger: 'onBlur',
                },
              ],
            })(<Input addonAfter="验证码" autoComplete="off" />)}
          </Form.Item>
          <Form.Item className="btn-group">
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const LoginForm = Form.create({ name: 'login_form' })(Login);

export default withRouter(LoginForm);
