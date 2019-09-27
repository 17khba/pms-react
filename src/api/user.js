/* ----- 用户管理、业务员管理、供应商管理 ------ */
import { createPostAPI } from './index';

/**
 * 获取列表
 * @param {Object} config
 */
export const GetUserList = config => {
  const url = 'User/PageList';
  return createPostAPI(url, config);
};

/**
 * 重置密码
 * @param {Object} config
 */
export const ResetUser = config => {
  const url = 'User/ResetUser';
  return createPostAPI(url, config);
};

/**
 * 添加用户
 * @param {Object} config
 */
export const AddUser = config => {
  const url = 'User/AddUser';
  return createPostAPI(url, config);
};

/**
 * 删除用户
 * @param {Object} config
 */
export const DelUser = config => {
  const url = 'User/DelUser';
  return createPostAPI(url, config);
};
