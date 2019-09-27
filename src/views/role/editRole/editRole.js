import React, { Component } from 'react';
import moment from 'moment';
import { Spin, Modal, Form, Tree, Input, notification, DatePicker, Switch } from 'antd';
import { reqHandle, errHandle } from '@/common/js/mixin';
import { GetTreelist } from '@/api';
import { UpdateRole } from '@/api/role';
require('moment/locale/zh-cn');

const { TreeNode } = Tree;

class EditRoleComponent extends Component {
  constructor(props) {
    super(props);
    this.refTree = React.createRef();
  }

  state = {
    loading: false,
    checkedData: [],
    checkId: [],
    checkedKeys: [],
    treeData: [],
    initCheckedKeys: [],
  };

  getMenuList = roleId => {
    this.setState({
      loading: true,
    });

    let url = `Module/TreeList/${roleId}?showResource=1`;

    GetTreelist(url)
      .then(reqHandle)
      .then(res => {
        const { data } = res;

        // 初始化选中状态
        let initCheckedKeys;
        this.initCheckStatus(data);
        ({ initCheckedKeys } = this.state);

        this.setState({
          checkedKeys: initCheckedKeys,
          initCheckedKeys: [],
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

  initCheckStatus = data => {
    // eslint-disable-next-line no-unused-vars
    let item, moduleCode, childModules, isChecked, hasChild, initCheckedKeys, rest;

    for (let i = 0; i < data.length; i++) {
      item = data[i];
      ({ moduleCode, childModules, isChecked, ...rest } = item);
      hasChild = childModules && childModules.length;
      if (hasChild) {
        this.initCheckStatus(childModules);
        continue;
      }

      if (isChecked === 1) {
        ({ initCheckedKeys } = this.state);
        initCheckedKeys.push(moduleCode);
        this.setState({
          initCheckedKeys,
        });
        continue;
      }
    }
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

    const role = this.props.form.getFieldsValue();
    const moduleResourcesList = this.getModuleResourcesList();
    const params = {
      role,
      moduleResourcesList,
    };

    UpdateRole(params)
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

  getModuleResourcesList = () => {
    const { tree } = this.refTree.current;
    const treeState = tree.state;
    const { halfCheckedKeys, checkedKeys, keyEntities } = treeState;

    /**
     * 根据目前被选中的节点所组成的数组，查找对应菜单及其资源ID集合
     */
    let moduleResourcesList = [];

    /**
     * 插入半选中节点
     */
    let halfItem, moduleId;
    for (const halfKey in halfCheckedKeys) {
      halfItem = keyEntities[halfCheckedKeys[halfKey]];
      moduleId = halfItem.node.props.dataRef.id;

      moduleResourcesList.push({
        moduleId,
        resourceIdList: [],
      });
    }

    let item, dataRef, parentID, id, isResource;
    for (const key in checkedKeys) {
      item = keyEntities[checkedKeys[key]];
      dataRef = item.node.props.dataRef;
      ({ parentID, id, isResource } = dataRef);

      if (!isResource) {
        moduleResourcesList.push({
          moduleId: id,
          resourceIdList: [],
        });

        continue;
      }

      /**
       * 为对应节点插入资源
       */
      // eslint-disable-next-line no-loop-func
      moduleResourcesList.find(item => {
        if (item.moduleId === parentID) {
          item.resourceIdList.push(id);
          return true;
        }
        return false;
      });
    }

    return moduleResourcesList;
  };

  handleCancel = () => {
    this.setState({
      checkedData: [],
      checkedKeys: [],
      checkId: [],
    });
    this.props.form.resetFields();
    this.props.hideEditModal();
  };

  handleCheck = (checkedKeys, { checkedNodes }) => {
    let checkedData = [],
      checkId = [],
      item,
      data,
      id,
      // eslint-disable-next-line no-unused-vars
      childModules,
      rest;

    for (let i = 0; i < checkedNodes.length; i++) {
      item = checkedNodes[i];
      data = item.props.dataRef;
      id = data.id;
      ({ childModules, ...rest } = data);
      checkedData.push(rest);
      checkId.push(id);
    }

    this.setState({ checkedKeys, checkedData, checkId });
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.childModules) {
        return (
          <TreeNode
            title={item.moduleName}
            checkable
            selectable={false}
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
          dataRef={item}
          key={item.moduleCode}
        />
      );
    });

  render() {
    const { loading, checkedKeys, treeData } = this.state;
    const { visible, formData, form } = this.props;
    const { getFieldDecorator } = form;
    const dateFormat = 'YYYY-MM-DD';

    getFieldDecorator('id', { initialValue: formData.id });

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
        title="编辑"
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
              <Form.Item label="角色名">
                {getFieldDecorator('roleName', {
                  initialValue: formData.roleName,
                  rules: [
                    {
                      required: true,
                      message: '请输入角色名!',
                    },
                  ],
                })(<Input placeholder="请输入角色名" allowClear autoComplete="off" />)}
              </Form.Item>
              <Form.Item label="说明" required>
                {getFieldDecorator('remark', {
                  initialValue: formData.remark,
                  rules: [
                    {
                      required: true,
                      message: '请输入说明!',
                    },
                  ],
                })(<Input placeholder="请输入说明" allowClear autoComplete="off" />)}
              </Form.Item>
              <Form.Item
                label="角色过期时间"
                extra="过期时间只对临时角色生效"
                className="form-item-datepicker"
              >
                {getFieldDecorator('expireTime', {
                  initialValue: moment(formData.expireTime, dateFormat),
                })(<DatePicker />)}
              </Form.Item>
              <Form.Item label="是否为临时角色">
                {getFieldDecorator('isTempRole', {
                  valuePropName: 'checked',
                  initialValue: !!formData.isTempRole,
                })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
              </Form.Item>
            </Form>
          </div>
          <div className="modal-right fl">
            <h4>关联菜单：</h4>
            {treeData.length ? (
              <Tree
                ref={this.refTree}
                checkable
                selectable={false}
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

const EditRoleModal = Form.create({
  name: 'EditRoleModal',
})(EditRoleComponent);

export default EditRoleModal;
