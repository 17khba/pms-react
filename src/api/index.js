import axios from 'axios';
import Config from '../config';
import { getItem, getItemStr, removeItem } from '../common/js/util';
import { notification } from 'antd';

const instance = axios.create({
  baseURL: Config.baseURL,
  timeout: 60000,
  headers: {
    Sign: getItemStr('uuid'),
  },
});

instance.interceptors.request.use(
  config => {
    /* --- 请求拦截处理 --- */
    const { url } = config;

    if (url === 'Captcha' || url === 'Login') return config;

    const user = getItem('qxkz_info');
    const token = user ? user.token : '';

    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  res => {
    if (res.status !== 200) {
      return Promise.reject(res);
    }

    /**
     * --- 响应拦截器处理 ---
     * 1. 判断请求是否成功
     * 2. 判断返回数据是否为空
     * 3. 判断是否有权限调用该接口，无则重定向
     */

    return res;
  },
  err => {
    const res = err.response;
    const message = err.message ? err.message : '出错了!';
    console.log(err);

    if (res && res.status === 401) {
      removeItem('qxkz_info');
      removeItem('uuid');
      removeItem('purchase_info');

      /**
       * TODO:
       * 跳转至登录页
       */
      return Promise.reject(err);
    }

    notification.error({
      message: '提示',
      description: message,
    });

    return Promise.reject(err);
  }
);

export const createGetAPI = (url, config) => {
  config = config || {};

  return instance.get(url, {
    params: config,
  });
};

export const createPostAPI = (url, config) => {
  config = config || {};

  return instance.post(url, config);
};

/**
 * 清除缓存
 * @param {Object} config
 */
export const ClearCache = config => {
  const url = 'ClearCache';
  return createGetAPI(url);
};

/**
 * 获取菜单树
 * @param {Object} config
 */
export const GetTreelist = config => {
  const url = config ? config : 'module/treelist';
  return createGetAPI(url);
};

/**
 * 获取菜单树
 * @param {Object} config
 */
export const GetTreelistNoSource = config => {
  const url = 'module/treelist/hideResource';
  return createGetAPI(url);
};

export default instance;
