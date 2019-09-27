/* ----- 用户管理、业务员管理、供应商管理 ------ */
import { createGetAPI, createPostAPI } from './index';

/**
 * 获取列表
 * @param {Object} config
 */
export const GetResourceList = config => {
  const url = 'Resource/PageList';
  return createPostAPI(url, config);
};

/**
 * 获取菜单明细
 * @param {Object} config
 */
export const GetSourceInfo = config => {
  const url = `Module/Get/${config}`;
  return createGetAPI(url, config);
};

/**
 * 资源列表-所有
 * @param {Object} config
 */
export const GetSourcelist = config => {
  const url = config ? `Resource/list/q/${config}` : 'Resource/list/q';
  return createGetAPI(url);
};

/**
 * 更新菜单
 * @param {Object} config
 */
export const UpdateMenu = config => {
  const url = 'Module/Update';
  return createPostAPI(url, config);
};

/**
 * 新建菜单
 * @param {Object} config
 */
export const CreateMenu = config => {
  const url = 'Module/Create';
  return createPostAPI(url, config);
};

/**
 * 删除菜单
 * @param {Object} config
 */
export const DelMenu = config => {
  const url = `Module/delete/${config}`;
  return createPostAPI(url, config);
};
