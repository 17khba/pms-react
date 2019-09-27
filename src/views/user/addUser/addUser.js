import React, { Component } from 'react';
import { Modal, Form, Input, notification } from 'antd';
import { reqHandle, errHandle } from '@/common/js/mixin';
import { AddUser } from '@/api/user';

class AddUserComponent extends Component {
  state = {
    loading: false,
    IsAdmin: 1,
    GysId: 0,
  };

  handleOk = () => {
    let isGoOn = true;

    this.props.form.validateFields((err, values) => {
      if (err) {
        isGoOn = false;
      }
    });

    if (!isGoOn) return;

    this.setState({
      loading: true,
    });

    const { IsAdmin, GysId } = this.state;
    const { Password, UserCode, UserName } = this.props.form.getFieldsValue();
    const params = {
      GysId,
      IsAdmin,
      Password,
      UserCode,
      UserName,
    };

    AddUser(params)
      .then(reqHandle)
      .then(res => {
        const { message } = res;

        this.setState({
          loading: false,
        });

        notification.success({
          message: '提示',
          description: message,
        });

        this.props.form.resetFields();

        this.props.hideAddModal();
        // 初始化
        this.props.init();
      })
      .catch(err => {
        setTimeout(() => {
          this.setState({
            loading: false,
          });
        }, 500);

        errHandle(err);
      });
  };
  handleCancel = () => {
    this.props.form.resetFields();
    this.props.hideAddModal();
  };

  render() {
    const { loading } = this.state;
    const { visible } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 3 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 20 },
      },
    };

    return (
      <Modal
        title="新增"
        visible={visible}
        confirmLoading={loading}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText="提交"
        cancelText="取消"
      >
        <Form {...formItemLayout} className="form-add">
          <Form.Item label="用户名">
            {getFieldDecorator('userName', {
              initialValue: '',
            })(<Input placeholder="请输入用户名" allowClear autoComplete="off" />)}
          </Form.Item>
          <Form.Item label="账号" required>
            {getFieldDecorator('userCode', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '请输入账号!',
                },
              ],
            })(<Input placeholder="请输入账号" allowClear autoComplete="off" />)}
          </Form.Item>
          <Form.Item label="密码" extra="非必填，默认 000000！">
            {getFieldDecorator('Password', {
              initialValue: '',
            })(<Input type="password" placeholder="请输入密码" allowClear autoComplete="off" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const AddUserModal = Form.create({
  name: 'AddUserModal',
})(AddUserComponent);

export default AddUserModal;
