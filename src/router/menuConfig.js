export default [
  {
    title: '权限管理',
    icon: 'appstore',
    key: 'sub1',
    children: [
      {
        title: '用户管理',
        icon: null,
        path: '/user',
      },
      {
        title: '角色管理',
        icon: null,
        path: '/role',
      },
    ],
  },
  {
    title: '基础资源管理',
    icon: 'setting',
    key: 'sub2',
    children: [
      {
        title: '资源维护',
        icon: null,
        path: '/dataMaintain',
      },
      {
        title: '菜单/模块管理',
        icon: null,
        path: '/moduleManage',
      },
    ],
  },
];
