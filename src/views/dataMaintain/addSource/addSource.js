import React, { Component } from 'react';
import { Spin, Modal, Form, Tree, Input, notification, Switch } from 'antd';
import { reqHandle, errHandle } from '@/common/js/mixin';
import { GetTreelistNoSource } from '@/api';
import { AddSource } from '@/api/dataMaintain';
require('moment/locale/zh-cn');

const { TreeNode } = Tree;

class AddSourceComponent extends Component {
  state = {
    loading: false,
    checkedKeys: null,
    treeData: [],
  };

  getMenuList = () => {
    this.setState({
      loading: true,
    });

    let url = 'module/treelist';

    GetTreelistNoSource(url)
      .then(reqHandle)
      .then(res => {
        const { data } = res;

        this.setState({
          treeData: data,
          loading: false,
        });
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

  handleOk = () => {
    let isGoOn = true;

    this.props.form.validateFields((err, values) => {
      if (err) {
        isGoOn = false;
      }
    });

    if (!isGoOn) return;

    const { id, ...params } = this.props.form.getFieldsValue();
    const { checkedKeys } = this.state;
    const { checked } = checkedKeys;
    const hasChecked = checked.length;

    if (!hasChecked) {
      notification.warning({
        message: '提示',
        description: '请选择关联菜单！',
      });

      return false;
    }

    this.setState({
      loading: true,
    });

    AddSource(params, id)
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

        this.handleCancel();
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
    this.setState({
      checkedKeys: [],
    });
    this.props.form.resetFields();
    this.props.hideModal();
  };

  handleCheck = (checkedKeys, { checked, node }) => {
    this.setState({ checkedKeys });

    if (!checked) {
      this.updateTree(false);
      return false;
    }

    let nodeId = node.props.dataRef.id;
    this.updateTree(true, nodeId);
  };

  updateTree = (checked, id) => {
    const { treeData } = this.state;

    if (!checked) {
      this.triggerCheckbox(treeData, false);
      return false;
    }

    this.triggerCheckbox(treeData, true, id);
  };

  triggerCheckbox = (data, status, id) => {
    const { setFieldsValue } = this.props.form;
    let hasChild;

    data.map(item => {
      hasChild = item.childModules && item.childModules.length;

      if (hasChild) {
        this.triggerCheckbox(item.childModules, status, id);
      }

      // 选中当前项操作
      if (id && id === item.id) {
        item.disabled = false;
        setFieldsValue({ id });
        return true;
      }

      item.disabled = status;
      return false;
    });

    this.setState({
      treeData: data,
    });
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.childModules) {
        return (
          <TreeNode
            title={item.moduleName}
            checkable
            selectable={false}
            disabled={item.disabled}
            dataRef={item}
            key={item.moduleCode}
          >
            {this.renderTreeNodes(item.childModules)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={item.moduleName}
          checkable
          selectable={false}
          disabled={item.disabled}
          dataRef={item}
          key={item.moduleCode}
        />
      );
    });

  render() {
    const { TextArea } = Input;
    const { loading, checkedKeys, treeData } = this.state;
    const { visible } = this.props;
    const { getFieldDecorator } = this.props.form;

    getFieldDecorator('id', { initialValue: null });

    const formItemLayout = {
      labelCol: {
        sm: { span: 6, offset: 3 },
        xs: { span: 6, offset: 3 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 12 },
      },
    };

    let loadingWrap;
    if (loading) {
      loadingWrap = (
        <div className="spin-wrap">
          <Spin spinning={loading} tip="加载中..." className="spin-add-role"></Spin>
        </div>
      );
    } else {
      loadingWrap = null;
    }

    return (
      <Modal
        title="新增"
        confirmLoading={loading}
        visible={visible}
        keyboard={false}
        maskClosable={false}
        destroyOnClose={true}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText="提交"
        cancelText="取消"
        width={848}
      >
        {loadingWrap}
        <div className="modal-wrap clearfix">
          <div className="modal-left fl">
            <Form {...formItemLayout} className="form-add">
              <Form.Item label="资源名" required>
                {getFieldDecorator('resourceName', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '请输入资源名!',
                    },
                  ],
                })(<Input placeholder="请输入资源名" allowClear autoComplete="off" />)}
              </Form.Item>
              <Form.Item label="权限代码" required>
                {getFieldDecorator('resourceCode', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '请输入权限代码!',
                    },
                  ],
                })(<Input placeholder="请输入权限代码" allowClear autoComplete="off" />)}
              </Form.Item>
              <Form.Item label="路由">
                {getFieldDecorator('routing', {
                  initialValue: '',
                })(<Input placeholder="请输入路由" allowClear autoComplete="off" />)}
              </Form.Item>
              <Form.Item label="说明">
                {getFieldDecorator('remark', {
                  initialValue: '',
                })(<TextArea rows="4" placeholder="请输入说明" autoComplete="off" />)}
              </Form.Item>
              <Form.Item className="form-item-enable" label="是否启用">
                {getFieldDecorator('isEnable', { valuePropName: 'checked', initialValue: true })(
                  <Switch checkedChildren="是" unCheckedChildren="否" />
                )}
              </Form.Item>
              <Form.Item label="是否公开">
                {getFieldDecorator('isOpen', { valuePropName: 'checked', initialValue: false })(
                  <Switch checkedChildren="是" unCheckedChildren="否" />
                )}
              </Form.Item>
            </Form>
          </div>
          <div className="modal-right fl">
            <h4 className="ant-form-item-required">关联菜单：</h4>
            {treeData.length ? (
              <Tree
                checkable
                selectable={false}
                checkStrictly={true}
                defaultExpandAll={true}
                onCheck={this.handleCheck}
                checkedKeys={checkedKeys}
              >
                {this.renderTreeNodes(treeData)}
              </Tree>
            ) : (
              'loading tree...'
            )}
          </div>
        </div>
      </Modal>
    );
  }
}

const AddSourceModal = Form.create({
  name: 'AddSourceModal',
})(AddSourceComponent);

export default AddSourceModal;
