/**
 * 资源维护
 */
import React, { Component } from 'react';

import {
  Table,
  Form,
  Checkbox,
  Input,
  Button,
  Pagination,
  notification,
  Popconfirm,
  Modal,
  Tag,
} from 'antd';
import Config from '@/config';
import { reqHandle, errHandle } from '@/common/js/mixin';
import { GetResourceList, DelSourceItem, BatchDelete } from '@/api/dataMaintain';
import AddSource from './addSource/addSource';
import EditSource from './editSource/editSource';
import './index.less';

class DataMaintain extends Component {
  state = {
    loading: false,
    removeLoading: false,
    addVisible: false,
    editVisible: false,
    selectedRowKeys: [],
    checkedAll: false,
    IsAdmin: 1,
    data: [],
    filterBy: {},
    editSource: {},
    pagination: {
      total: 50,
      pageIndex: 1,
      pageNum: Config.PAGE_SIZE,
    },
  };

  componentDidMount = () => {
    this.init();
  };

  init = () => {
    this.setState({
      loading: true,
      checkedAll: false,
    });

    const { IsAdmin, pagination, filterBy } = this.state;
    const { pageIndex, pageNum } = pagination;

    // 用户是否使用过筛选功能（点击查询）
    const isSearched = Object.keys(filterBy).length;

    let resourceName, route;
    if (isSearched) {
      resourceName = filterBy.resourceName;
      route = filterBy.route;
    } else {
      resourceName = '';
      route = '';
    }

    const params = { IsAdmin, pageIndex, pageNum, resourceName, route };

    this.getPageList(params);
  };

  getPageList = params => {
    GetResourceList(params)
      .then(reqHandle)
      .then(res => {
        const { data } = res;
        const result = data.list ? data.list : [];
        const total = data.count;

        const pager = this.state.pagination;
        pager.total = total;

        this.setState({
          loading: false,
          data: result,
          pagination: pager,
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

  handleSearch = () => {
    let { resourceName, route } = this.props.form.getFieldsValue();
    resourceName = resourceName.trim();
    route = route.trim();
    const pager = this.state.pagination;
    pager.pageIndex = 1;

    this.setState({
      filterBy: {
        resourceName,
        route,
      },
      pagination: pager,
    });

    this.init();
  };

  handleReset = () => {
    const pager = this.state.pagination;
    this.props.form.resetFields();

    pager.pageIndex = 1;

    this.setState({
      filterBy: {},
      pagination: pager,
    });

    this.init();
  };

  showModalAdd = () => {
    this.refAddModel.getMenuList();

    this.setState({
      addVisible: true,
    });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    debugger;

    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });

    /**
     * TODO:
     * 获取数据
     */
  };

  handleSizeChange = (current, pageSize) => {
    const pager = { ...this.state.pagination };
    pager.pageIndex = 1;
    pager.pageNum = pageSize;
    this.setState({
      pagination: pager,
    });

    this.init();
  };

  handleCurrentChange = (page, pageSize) => {
    const pager = { ...this.state.pagination };
    pager.pageIndex = page;
    this.setState({
      selectedRowKeys: [],
      pagination: pager,
    });

    this.init();
  };

  handleChekedAll = e => {
    const { data } = this.state;
    const checked = e.target.checked;
    let selectedRowKeys = [];

    if (checked) {
      selectedRowKeys = data.map(item => item.id);
    }

    this.setState({
      checkedAll: e.target.checked,
      selectedRowKeys,
    });
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    const { data } = this.state;
    const checkboxLen = data.length;
    const checkedLen = selectedRowKeys.length;

    this.setState({
      selectedRowKeys,
      checkedAll: checkboxLen === checkedLen,
    });
  };

  handleDel = row => {
    this.setState({
      loading: true,
    });

    const { id } = row;
    this.delSource(id);
  };

  delSource = id => {
    DelSourceItem(id)
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

  handleEdit = row => {
    const { id, resourceName, resourceCode, remark, routing, isOpen, isEnable, moduleId } = row;

    this.setState({
      editSource: { id, resourceName, resourceCode, remark, routing, isOpen, isEnable, moduleId },
      editVisible: true,
    });

    this.refEditModel.getMenuList(moduleId);
  };

  hideAddModal = () => {
    this.setState({
      addVisible: false,
    });
  };

  hideEditModal = () => {
    this.setState({
      editVisible: false,
    });
  };

  showDelConfirm = () => {
    const self = this;
    const { confirm } = Modal;
    const { selectedRowKeys } = this.state;
    const params = {
      idList: selectedRowKeys,
    };

    confirm({
      title: '提示',
      content: '确认删除选中资源？',
      onOk() {
        return new Promise((resolve, reject) => {
          BatchDelete(params)
            .then(reqHandle)
            .then(res => {
              const { message } = res;

              self.setState({
                selectedRowKeys: [],
                removeLoading: false,
              });

              notification.success({
                message: '提示',
                description: message,
              });

              // 初始化
              self.handleSearch();

              resolve();
            })
            .catch(err => {
              setTimeout(() => {
                self.setState({
                  removeLoading: false,
                });
              }, 500);

              errHandle(err);

              reject();
            });
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {},
    });
  };

  render() {
    const {
      loading,
      selectedRowKeys,
      data,
      pagination,
      checkedAll,
      addVisible,
      editVisible,
      editSource,
    } = this.state;
    const { total, pageNum, pageIndex } = pagination;
    const pageSizeOptions = ['10', '20', '30', '40'];
    const columns = [
      {
        title: '#',
        align: 'center',
        key: 'index',
        width: '6%',
        render: (value, row, index) => <span>{(pageIndex - 1) * pageNum + (index + 1)}</span>,
      },
      {
        title: '资源名称',
        key: 'resourceName',
        dataIndex: 'resourceName',
        align: 'center',
        width: '130px',
      },
      {
        title: '权限代码',
        key: 'resourceCode',
        dataIndex: 'resourceCode',
        align: 'center',
        width: '120px',
      },
      {
        title: '是否启用',
        key: 'isEnable',
        dataIndex: 'isEnable',
        align: 'center',
        width: '80px',
        render: (text, record) => {
          const isEnable = record.isEnable;

          return isEnable ? <Tag color="blue">是</Tag> : <Tag color="red">否</Tag>;
        },
      },
      {
        title: '是否公共',
        key: 'IsOpen',
        dataIndex: 'IsOpen',
        align: 'center',
        width: '80px',
        render: (text, record) => {
          const IsOpen = record.IsOpen;

          return IsOpen ? <Tag color="blue">是</Tag> : <Tag color="red">否</Tag>;
        },
      },
      {
        title: '路由',
        key: 'routing',
        dataIndex: 'routing',
        align: 'center',
      },
      {
        title: '备注',
        key: 'remark',
        dataIndex: 'remark',
        align: 'center',
        width: '220px',
      },
      {
        title: '操作',
        key: 'action',
        width: '120px',
        render: (text, record) =>
          this.state.data.length >= 1 ? (
            <span>
              <Button onClick={() => this.handleEdit(record)} type="link">
                编辑
              </Button>
              <Popconfirm title="确定删除?" onConfirm={() => this.handleDel(record)}>
                <a href="/#">删 除</a>
              </Popconfirm>
            </span>
          ) : null,
        align: 'center',
      },
    ];
    const { getFieldDecorator } = this.props.form;

    const rowSelection = {
      columnWidth: '80px',
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    return (
      <div className="data-maintain">
        {/* 表单筛选区域 */}
        <Form layout="inline" className="form-inline">
          <Form.Item label="资源名称">
            {getFieldDecorator('resourceName', {
              initialValue: '',
            })(<Input placeholder="请输入资源名称" allowClear autoComplete="off" />)}
          </Form.Item>
          <Form.Item label="路由名称">
            {getFieldDecorator('route', {
              initialValue: '',
            })(<Input placeholder="请输入路由名称" allowClear autoComplete="off" />)}
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={this.handleSearch}>
              查询
            </Button>
            <Button className="btn" onClick={this.handleReset}>
              重置
            </Button>
            <Button icon="plus" className="btn" onClick={this.showModalAdd}>
              新增
            </Button>
            <Button
              icon="delete"
              onClick={this.showDelConfirm}
              disabled={!hasSelected}
              className="btn"
            >
              删除
            </Button>
          </Form.Item>
        </Form>
        {/* 正文数据部分 */}
        <Table
          rowKey="id"
          columns={columns}
          rowSelection={rowSelection}
          onChange={this.handleTableChange}
          dataSource={data}
          pagination={false}
          loading={loading}
          size="middle"
        />
        {/* 分页部分 */}
        <div className="pagination-wrap clearfix">
          <Checkbox checked={checkedAll} onChange={this.handleChekedAll} className="fl">
            全选
          </Checkbox>
          <Pagination
            showSizeChanger
            pageSizeOptions={pageSizeOptions}
            onShowSizeChange={this.handleSizeChange}
            showTotal={total => `共${total}条`}
            showQuickJumper
            total={total}
            pageSize={pageNum}
            current={pageIndex}
            onChange={this.handleCurrentChange}
            className="fr"
          />
        </div>
        {/* 新增弹窗 */}
        <AddSource
          wrappedComponentRef={refAddModel => (this.refAddModel = refAddModel)}
          visible={addVisible}
          hideModal={this.hideAddModal}
          init={this.handleSearch}
        ></AddSource>
        {/* 编辑弹窗 */}
        <EditSource
          wrappedComponentRef={refEditModel => (this.refEditModel = refEditModel)}
          visible={editVisible}
          data={editSource}
          hideModal={this.hideEditModal}
          init={this.init}
        ></EditSource>
      </div>
    );
  }
}

const DataMaintainForm = Form.create({
  name: 'DataMaintainForm',
})(DataMaintain);

export default DataMaintainForm;
