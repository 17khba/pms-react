/**
 * 菜单、模块管理
 */
import React, { Component } from 'react';

import {
  Form,
  Input,
  InputNumber,
  Button,
  Tree,
  Spin,
  Icon,
  Tooltip,
  Select,
  Switch,
  Empty,
  notification,
  Popconfirm,
} from 'antd';
import './index.less';
import { reqHandle, errHandle } from '@/common/js/mixin';
import { GetTreelistNoSource } from '@/api';
import { GetSourceInfo, GetSourcelist, UpdateMenu, CreateMenu, DelMenu } from '@/api/moduleManage';

const { TextArea } = Input;
const { TreeNode } = Tree;
const { Option } = Select;

class moduleManage extends Component {
  state = {
    loading: false,
    formLoading: false,
    treeData: [],
    expandedKeys: [],
    autoExpandParent: true,
    hasData: false,
    isEdit: false,
    formModule: {},
    resources: [],
    resourceIdList: [],
  };

  componentDidMount = () => {
    this.getMenuList();
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

  handleExpand = (expandedKeys, { expanded, node }) => {
    const { id } = node.props.dataRef;

    this.setState({
      expandedKeys: expanded ? [id + ''] : [],
    });
  };

  handleEditMenu = (e, data, parentData) => {
    let parentLabel;
    if (parentData) {
      ({ moduleName: parentLabel } = parentData);
    } else {
      parentLabel = '';
    }
    const { id } = data;

    this.getSourceInfo(id, parentLabel);

    e.stopPropagation();
  };

  getSourceInfo = (id, parentLabel) => {
    this.setState({
      formLoading: true,
    });

    // 获取资源项
    this.getSourceList();

    GetSourceInfo(id)
      .then(reqHandle)
      .then(res => {
        const { data } = res;
        const { module, resources } = data;
        const { isDelete, createTime, updateTime, ...rest } = module;

        const hasResource = resources.length;
        let resourceIdList;
        if (hasResource) {
          resourceIdList = resources.map(item => item.id);
        } else {
          resourceIdList = [];
        }

        this.setState({
          formModule: { parentLabel, ...rest },
          resourceIdList,
          hasData: true,
          isEdit: true,
          formLoading: false,
        });
      })
      .catch(err => {
        setTimeout(() => {
          this.setState({
            formLoading: false,
          });
        }, 500);

        errHandle(err);
      });
  };

  getSourceList = () => {
    GetSourcelist()
      .then(reqHandle)
      .then(res => {
        const { data } = res;

        this.setState({
          resources: data,
          hasData: true,
          formLoading: false,
        });
      })
      .catch(err => {
        setTimeout(() => {
          this.setState({
            formLoading: false,
          });
        }, 500);

        errHandle(err);
      });
  };

  handleAddMenu = (e, data) => {
    this.props.form.resetFields();

    const { id, moduleName } = data;

    this.setState({
      formModule: {
        id: 0,
        parentLabel: moduleName,
        moduleCode: '',
        moduleName: '',
        iconClass: '',
        remark: '',
        parentID: id,
        isOpen: 0,
        orderId: 0,
        uiRouting: '',
      },
      resources: [],
      resourceIdList: [],
      formLoading: true,
      isEdit: false,
    });

    this.getSourceList();

    e.stopPropagation();
  };
  handleDelMenu = e => {
    e.stopPropagation();
  };

  handleMouseOver = e => {
    e.currentTarget.classList.add('show-opreate-group');
    e.stopPropagation();
  };

  handleMouseOut = e => {
    e.currentTarget.classList.remove('show-opreate-group');
    e.stopPropagation();
  };

  handleSave = () => {
    let isGoOn = true;

    this.props.form.validateFields((err, values) => {
      if (err) {
        isGoOn = false;
      }
    });

    if (!isGoOn) return;

    const { isEdit } = this.state;
    const { parentLabel, resourceIdList, ...module } = this.props.form.getFieldsValue();

    this.setState({
      formLoading: true,
    });

    const params = {
      module,
      resourceIdList,
    };

    if (isEdit) {
      this.updateMenu(params);
      return false;
    }

    this.createMenu(params);
  };

  updateMenu = params => {
    UpdateMenu(params)
      .then(reqHandle)
      .then(res => {
        const { message } = res;

        this.setState({
          formLoading: false,
        });

        notification.success({
          message: '提示',
          description: message,
        });

        this.getMenuList();
      })
      .catch(err => {
        setTimeout(() => {
          this.setState({
            formLoading: false,
          });
        }, 500);

        errHandle(err);
      });
  };

  createMenu = params => {
    CreateMenu(params)
      .then(reqHandle)
      .then(res => {
        const { message } = res;

        this.setState({
          formLoading: false,
        });

        notification.success({
          message: '提示',
          description: message,
        });

        this.getMenuList();
      })
      .catch(err => {
        setTimeout(() => {
          this.setState({
            formLoading: false,
          });
        }, 500);

        errHandle(err);
      });
  };

  handleReset = () => {
    this.setState({
      formLoading: true,
    });

    this.props.form.resetFields();

    setTimeout(() => {
      this.setState({
        formLoading: false,
      });
    }, 500);
  };

  handleFilter = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  handleConfirm = (e, data) => {
    const { id } = data;

    this.setState({
      loading: true,
    });

    DelMenu(id)
      .then(reqHandle)
      .then(res => {
        const { message } = res;

        this.setState({
          formLoading: false,
        });

        notification.success({
          message: '提示',
          description: message,
        });

        this.getMenuList();
      })
      .catch(err => {
        setTimeout(() => {
          this.setState({
            loading: false,
          });
        }, 500);

        errHandle(err);
      });

    e.stopPropagation();
  };

  handleCancel = () => {};

  renderTreeNodes = (data, parentData) => {
    const customLabel = nodeData => (
      <span
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        className="custom-tree-node"
      >
        <span className="tree-label">{nodeData.moduleName}</span>
        <span className="tree-custom">
          <Tooltip title="编辑">
            <Icon
              onClick={e => this.handleEditMenu(e, nodeData, parentData)}
              type="edit"
              style={{ fontSize: '16px' }}
              theme="twoTone"
            />
          </Tooltip>
          <Tooltip title="新建">
            <Icon
              onClick={e => this.handleAddMenu(e, nodeData)}
              type="plus-circle"
              style={{ fontSize: '16px' }}
              theme="twoTone"
            />
          </Tooltip>
          <Tooltip title="删除" placement="right">
            <Popconfirm
              title={`确定删除${nodeData.moduleName}菜单?`}
              onConfirm={e => this.handleConfirm(e, nodeData)}
              onCancel={this.handleCancel}
              icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
              okText="确定"
              cancelText="取消"
            >
              <Icon type="delete" style={{ fontSize: '16px' }} theme="twoTone" />
            </Popconfirm>
          </Tooltip>
        </span>
      </span>
    );

    return data.map(item => {
      if (item.childModules) {
        return (
          <TreeNode title={customLabel(item)} dataRef={item} key={item.id}>
            {this.renderTreeNodes(item.childModules, item)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.moduleName} dataRef={item} key={item.id} />;
    });
  };

  render() {
    const {
      loading,
      treeData,
      expandedKeys,
      autoExpandParent,
      isEdit,
      resources,
      resourceIdList,
      formModule,
      hasData,
      formLoading,
    } = this.state;
    const { getFieldDecorator } = this.props.form;

    getFieldDecorator('id', { initialValue: formModule.id });
    getFieldDecorator('parentID', { initialValue: formModule.parentID });

    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };

    let treeLoadingWrap;
    if (loading) {
      treeLoadingWrap = (
        <div className="spin-wrap">
          <Spin spinning={loading} tip="加载中..." className="spin-add-role"></Spin>
        </div>
      );
    } else {
      treeLoadingWrap = null;
    }

    let formLoadingWrap;
    if (formLoading) {
      formLoadingWrap = (
        <div className="spin-wrap">
          <Spin spinning={formLoading} tip="加载中..."></Spin>
        </div>
      );
    } else {
      formLoadingWrap = null;
    }

    let options;
    if (resources.length) {
      options = resources.map(item => (
        <Option key={item.id} value={item.id}>
          {item.resourceName}
        </Option>
      ));
    } else {
      options = null;
    }
    return (
      <div className="module-manage clearfix">
        {/* 菜单树 */}
        <div className="tree-group fl">
          <div className="tree-wrap">
            {treeLoadingWrap}
            <Button className="btn-add" type="primary">
              添加
            </Button>
            {treeData.length ? (
              <Tree
                expandedKeys={expandedKeys}
                onExpand={this.handleExpand}
                autoExpandParent={autoExpandParent}
              >
                {this.renderTreeNodes(treeData)}
              </Tree>
            ) : (
              'loading tree...'
            )}
          </div>
        </div>
        {/* 表单信息（菜单） */}
        <div className="form-group fr">
          <div className="form-wrap">
            {/* loading 动画 */}
            {formLoadingWrap}
            {/* 表单正文 */}
            {hasData && !formLoading ? (
              <div>
                <h3>{isEdit ? '编辑' : '新增'}</h3>
                <Form {...formItemLayout} className="form-inline">
                  <Form.Item label="上级">
                    {getFieldDecorator('parentLabel', {
                      initialValue: formModule.parentLabel,
                    })(<Input disabled />)}
                  </Form.Item>
                  <Form.Item label="名称" required>
                    {getFieldDecorator('moduleName', {
                      initialValue: formModule.moduleName,
                      rules: [
                        {
                          required: true,
                          message: '请输入名称!',
                        },
                      ],
                    })(<Input placeholder="请输入名称" allowClear autoComplete="off" />)}
                  </Form.Item>
                  <Form.Item label="编号" required>
                    {getFieldDecorator('moduleCode', {
                      initialValue: formModule.moduleCode,
                      rules: [
                        {
                          required: true,
                          message: '请输入编号!',
                        },
                      ],
                    })(<Input placeholder="请输入编号" allowClear autoComplete="off" />)}
                  </Form.Item>
                  <Form.Item label="前端路由">
                    {getFieldDecorator('uiRouting', {
                      initialValue: formModule.uiRouting,
                    })(<Input placeholder="请输入路由名称" allowClear autoComplete="off" />)}
                  </Form.Item>
                  <Form.Item label="图标 class">
                    {getFieldDecorator('iconClass', {
                      initialValue: formModule.iconClass,
                    })(<Input placeholder="请输入图标 class" allowClear autoComplete="off" />)}
                  </Form.Item>
                  <Form.Item label="说明">
                    {getFieldDecorator('remark', {
                      initialValue: formModule.remark,
                    })(<TextArea rows={4} placeholder="请输入说明" />)}
                  </Form.Item>
                  <Form.Item label="资源项">
                    {getFieldDecorator('resourceIdList', {
                      initialValue: resourceIdList,
                    })(
                      <Select mode="multiple" filterOption={this.handleFilter} placeholder="请选择">
                        {options}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item label="是否公开">
                    {getFieldDecorator('isOpen', {
                      valuePropName: 'checked',
                      initialValue: !!formModule.isOpen,
                    })(<Switch />)}
                  </Form.Item>
                  <Form.Item label="排序">
                    {getFieldDecorator('orderId', { initialValue: formModule.orderId })(
                      <InputNumber min={0} step={1} />
                    )}
                  </Form.Item>
                  <Form.Item className="btn-group" wrapperCol={{ offset: 3 }}>
                    <Button type="primary" onClick={this.handleSave}>
                      保存
                    </Button>
                    <Button onClick={this.handleReset}>重置</Button>
                  </Form.Item>
                </Form>
              </div>
            ) : (
              <div className="form-empty">
                <Empty />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const ModuleManageForm = Form.create({
  name: 'ModuleManageForm',
})(moduleManage);

export default ModuleManageForm;
