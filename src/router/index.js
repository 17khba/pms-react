import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Layout from '../layouts';
import Login from '../components/login';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { getItem } from '../common/js/util';

// 登录验证
function requireAuth(Layout, props) {
  const isLogin = props.location.pathname === '/login';
  const User = getItem('qxkz_info');

  if (isLogin) return <Login {...props} />;

  // 未登录
  if (!User) return <Redirect to="/login" />;

  return (
    <ConfigProvider locale={zhCN}>
      <Layout {...props} />
    </ConfigProvider>
  );
}

const BasicRouter = () => (
  <Router>
    <Route path="/" component={props => requireAuth(Layout, props)} />
  </Router>
);

export default BasicRouter;
