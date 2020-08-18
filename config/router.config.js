const routes = [
  { path: '/', exact: true, redirect: '/boostshare/home' },
  // {
  //   path: '/user',
  //   component: '../layouts/UserLayout',
  //   routes: [
  //     { path: '/user', redirect: '/user/login' },
  //     {
  //       path: '/user/login',
  //       component: './Login'
  //     },
  //     {
  //       component: './404'
  //     }
  //   ]
  // },
  {
    path: '/500',
    component: './500'
  },

  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/boostshare',
        name: '数据共享',
        routes: [
          // { path: '/boostshare', exact: true, redirect: '/boostshare/case/create' },
          {
            path: '/boostshare/home',
            name: '首页',
            component: './Home'
          },
          {
            path: '/boostshare/list',
            name: '列表',
            component: './List'
          }
        ]
      }
    ]
  }
]

export default routes
