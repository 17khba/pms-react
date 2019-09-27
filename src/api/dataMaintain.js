/* ----- 用户管理、业务员管理、供应商管理 ------ */
import { createPostAPI } from './index';

/**
 * 获取列表
 * @param {Object} config
 */
export const GetResourceList = config => {
  const url = 'Resource/PageList';
  return createPostAPI(url, config);
};

/**
 * 新增资源
 * @param {Object} config
 */
export const AddSource = (config, moduleId) => {
  const url = moduleId ? `Resource/Create/menu/${moduleId}` : 'Resource/Create';
  return createPostAPI(url, config);
};

/**
 * 更新操作
 * @param {Object} config
 */
export const UpdateSource = (config, moduleId) => {
  const url = moduleId ? `Resource/Update/menu/${moduleId}` : 'Resource/Update';
  return createPostAPI(url, config);
};

/**
 * 单条删除操作
 * @param {Object} config
 */
export const DelSourceItem = config => {
  const url = `Resource/Delete/${config}`;
  return createPostAPI(url, config);
};

/**
 * 获取列表
 * @param {Object} config
 */
export const BatchDelete = config => {
  const url = 'Resource/BatchDelete';
  return createPostAPI(url, config);
};
