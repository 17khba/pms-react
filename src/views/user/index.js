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
} from 'antd';
import Config from '@/config';
import { reqHandle, errHandle } from '@/common/js/mixin';
import { GetUserList, ResetUser, DelUser } from '@/api/user';
import AddUser from './addUser/addUser';
import './index.less';

class UserManage extends Component {
  state = {
    loading: false,
    removeLoading: false,
    addVisible: false,
    selectedRowKeys: [],
    checkedAll: false,
    IsAdmin: 1,
    data: [],
    filterBy: {},
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

    let userName, userCode;
    if (isSearched) {
      userName = filterBy.userName;
      userCode = filterBy.userCode;
    } else {
      userName = '';
      userCode = '';
    }

    const params = { IsAdmin, pageIndex, pageNum, userName, userCode };

    this.getUserList(params);
  };

  getUserList = params => {
    GetUserList(params)
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
    let { userName, userCode } = this.props.form.getFieldsValue();
    userName = userName.trim();
    userCode = userCode.trim();
    const pager = this.state.pagination;
    pager.pageIndex = 1;

    this.setState({
      filterBy: {
        userName,
        userCode,
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
      selectedRowKeys = data.map(item => item.userCode);
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

  handleResetPw = userCode => {
    this.setState({
      loading: true,
    });

    const params = { userCode };
    this.resetPw(params);
  };
  resetPw = params => {
    ResetUser(params)
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

  hideAddModal = () => {
    this.setState({
      addVisible: false,
    });
  };

  showDelConfirm = () => {
    const self = this;
    const { confirm } = Modal;
    const { selectedRowKeys } = this.state;
    const params = {
      ids: selectedRowKeys,
    };

    confirm({
      title: '提示',
      content: '确认删除选中用户？',
      onOk() {
        return new Promise((resolve, reject) => {
          DelUser(params)
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
    const { loading, selectedRowKeys, data, pagination, checkedAll, addVisible } = this.state;
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
        title: '用户名',
        key: 'userName',
        dataIndex: 'userName',
        align: 'center',
        width: '16%',
      },
      {
        title: '账号',
        key: 'userCode',
        dataIndex: 'userCode',
        align: 'center',
        width: '16%',
      },
      {
        title: '创建时间',
        key: 'createTime',
        dataIndex: 'createTime',
        align: 'center',
        width: '12%',
      },
      {
        title: '修改时间',
        key: 'updateTime',
        dataIndex: 'updateTime',
        align: 'center',
        width: '12%',
      },
      {
        title: '操作',
        key: 'action',
        width: '8%',
        render: (text, record) =>
          this.state.data.length >= 1 ? (
            <Popconfirm title="确定重置密码?" onConfirm={() => this.handleResetPw(record.userCode)}>
              <a href="/#">重置密码</a>
            </Popconfirm>
          ) : null,
        align: 'center',
      },
    ];
    const { getFieldDecorator } = this.props.form;

    const rowSelection = {
      columnWidth: '60px',
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    return (
      <div className="user-manage">
        {/* 表单筛选区域 */}
        <Form layout="inline" className="form-inline">
          <Form.Item label="用户名">
            {getFieldDecorator('userName', {
              initialValue: '',
            })(<Input placeholder="请输入用户名" allowClear autoComplete="off" />)}
          </Form.Item>
          <Form.Item label="账号">
            {getFieldDecorator('userCode', {
              initialValue: '',
            })(<Input placeholder="请输入账号" allowClear autoComplete="off" />)}
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
        <AddUser
          visible={addVisible}
          hideAddModal={this.hideAddModal}
          init={this.handleSearch}
        ></AddUser>
      </div>
    );
  }
}

const UserManageForm = Form.create({
  name: 'UserManageForm',
})(UserManage);

export default UserManageForm;
