import React, { Component } from 'react';
import Config from '@/config';
import { reqHandle, errHandle } from '@/common/js/mixin';
import { GetRoleList, DelRole } from '@/api/role';
import { Table, Form, Tag, Checkbox, Input, Button, Pagination, notification, Modal } from 'antd';
import './index.less';
import AddRole from './addRole/addRole';
import EditRole from './editRole/editRole';

class RoleManage extends Component {
  state = {
    loading: false,
    removeLoading: false,
    addVisible: false,
    editVisible: false,
    selectedRowKeys: [],
    checkedAll: false,
    data: [],
    filterBy: {},
    pagination: {
      total: 50,
      pageIndex: 1,
      pageNum: Config.PAGE_SIZE,
    },
    formData: {},
  };
  componentDidMount = () => {
    this.init();
  };

  init = () => {
    this.setState({
      loading: true,
      checkedAll: false,
    });

    const { pagination, filterBy } = this.state;
    const { pageIndex, pageNum } = pagination;

    // 用户是否使用过筛选功能（点击查询）
    const isSearched = Object.keys(filterBy).length;

    let roleName;
    if (isSearched) {
      roleName = filterBy.roleName;
    } else {
      roleName = '';
    }

    const params = { pageIndex, pageNum, roleName };

    this.getRoleList(params);
  };

  getRoleList = params => {
    GetRoleList(params)
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
    let { roleName } = this.props.form.getFieldsValue();
    roleName = roleName.trim();
    const pager = this.state.pagination;
    pager.pageIndex = 1;

    this.setState({
      filterBy: { roleName },
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

  showDelConfirm = () => {
    const self = this;
    const { confirm } = Modal;
    const { selectedRowKeys } = this.state;
    const params = {
      idList: selectedRowKeys,
    };

    confirm({
      title: '提示',
      content: ' 确认删除选中角色？',
      onOk() {
        return new Promise((resolve, reject) => {
          DelRole(params)
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

  showModalEdit = record => {
    const { id, roleName, remark, expireTime, isTempRole } = record;

    this.refEditModel.getMenuList(id);

    this.setState({
      formData: { id, roleName, remark, expireTime, isTempRole },
      editVisible: true,
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

  render() {
    const {
      loading,
      selectedRowKeys,
      data,
      pagination,
      checkedAll,
      addVisible,
      editVisible,
      formData,
    } = this.state;
    const { total, pageNum, pageIndex } = pagination;
    const pageSizeOptions = ['10', '20', '30', '40'];
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: '#',
        align: 'center',
        key: 'index',
        width: 80,
        render: (value, row, index) => <span>{(pageIndex - 1) * pageNum + (index + 1)}</span>,
      },
      {
        title: '角色名',
        key: 'roleName',
        dataIndex: 'roleName',
        align: 'center',
      },
      {
        title: '是否临时角色',
        key: 'isTempRole',
        dataIndex: 'isTempRole',
        align: 'center',
        width: 110,
        render: (text, record) => {
          const isTempRole = record.isTempRole;

          return isTempRole ? <Tag color="blue">是</Tag> : <Tag color="red">否</Tag>;
        },
      },
      {
        title: '创建时间',
        key: 'createTime',
        dataIndex: 'createTime',
        align: 'center',
        width: 170,
      },
      {
        title: '修改时间',
        key: 'updateTime',
        dataIndex: 'updateTime',
        align: 'center',
        width: 170,
      },
      {
        title: '过期时间',
        key: 'expireTime',
        dataIndex: 'expireTime',
        align: 'center',
        width: 170,
      },
      {
        title: '备注',
        key: 'remark',
        dataIndex: 'remark',
        align: 'center',
      },
      {
        title: '操作',
        key: 'action',
        width: 80,
        render: (text, record) => (
          <Button onClick={() => this.showModalEdit(record)} type="link" size="small">
            编辑
          </Button>
        ),
        align: 'center',
      },
    ];

    const rowSelection = {
      columnWidth: '80px',
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    return (
      <div className="role-manage">
        {/* 表单筛选区域 */}
        <Form layout="inline" className="form-inline">
          <Form.Item label="角色名">
            {getFieldDecorator('roleName', {
              initialValue: '',
            })(<Input placeholder="请输入角色名" allowClear autoComplete="off" />)}
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
        {/* 正文数据 */}
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
        {/* 分页 */}
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
        <AddRole
          wrappedComponentRef={refAddModel => (this.refAddModel = refAddModel)}
          visible={addVisible}
          hideAddModal={this.hideAddModal}
          init={this.handleSearch}
        ></AddRole>
        <EditRole
          wrappedComponentRef={refEditModel => (this.refEditModel = refEditModel)}
          visible={editVisible}
          formData={formData}
          hideEditModal={this.hideEditModal}
          init={this.init}
        ></EditRole>
      </div>
    );
  }
}

const RoleManageForm = Form.create({
  name: 'RoleManageForm',
})(RoleManage);

export default RoleManageForm;
