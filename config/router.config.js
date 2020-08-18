const routes = [
  { path: '/', exact: true, redirect: '/home' },
  {
    path: '/500',
    component: './500'
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/home',
        component: './Home',
      },
    ]
  }
]

export default routes
