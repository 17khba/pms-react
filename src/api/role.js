/* ----- 用户管理、业务员管理、供应商管理 ------ */
import { createPostAPI } from './index';

/**
 * 获取列表
 * @param {Object} config
 */
export const GetRoleList = config => {
  const url = 'Role/PageList';
  return createPostAPI(url, config);
};

/**
 * 新增操作
 * @param {Object} config
 */
export const AddRole = config => {
  const url = 'Role/Create';
  return createPostAPI(url, config);
};

/**
 * 批量删除操作
 * @param {Object} config
 */
export const DelRole = config => {
  const url = 'Role/BatchDelete';
  return createPostAPI(url, config);
};

/**
 * 更新操作
 * @param {Object} config
 */
export const UpdateRole = config => {
  const url = 'Role/Update';
  return createPostAPI(url, config);
};
