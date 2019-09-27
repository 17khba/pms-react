import { createGetAPI, createPostAPI } from './index';

/**
 * 登录
 * @param {Object} config
 */
export const Login = config => {
  const url = 'Login';
  return createPostAPI(url, config);
};

/**
 * 登录
 * @param {Object} config
 */
export const Logout = config => {
  const url = 'logout';
  return createPostAPI(url, config);
};

/**
 * 登录页获取验证码
 * @param {Object} config
 */
export const GetCaptcha = config => {
  const url = 'Captcha';
  return createGetAPI(url, config);
};
