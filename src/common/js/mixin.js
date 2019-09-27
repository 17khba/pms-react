import { notification } from 'antd';

export const reqHandle = res => {
  const { code } = res.data;

  if (code !== 200) return Promise.reject(res);

  return Promise.resolve(res.data);
};

export const errHandle = err => {
  const status = err.status ? err.status : '';
  console.log(err);

  if (status === 200) {
    const info = err.data.Msg;

    notification.error({
      message: '提示',
      description: info,
    });

    return false;
  }
};
