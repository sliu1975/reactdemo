const menu = [
  {
    name: '数据共享',
    path: '/boostshare',
    children: [
      // {
      //   name: '概览',
      //   path: '/boostshare/overview',
      //   icon: 'sider-overview'
      // },
      {
        name: '协查事务管理',
        path: '/boostshare/case',
        icon: 'sider-datasdd',
        children: [
          {
            name: '创建协查事务',
            path: '/boostshare/case/create',
            children: []
          },
          {
            name: '协查事务列表',
            path: '/boostshare/case/list',
            children: []
          }
        ]
      },
      {
        name: '布控行动管理',
        path: '/boostshare/act',
        icon: 'sider-dataexcg',
        children: [
          {
            name: '创建布控行动',
            path: '/boostshare/act/create',
            children: []
          },
          {
            name: '布控行动列表',
            path: '/boostshare/act/list',
            children: []
          }
        ]
      },
      {
        name: '基础资料库',
        path: '/boostshare/basicData',
        icon: 'sider-sddctlg',
        children: [
          {
            name: '重点人员',
            path: '/boostshare/basicData/focusGroups',
            children: []
          },
          {
            name: '基站信息',
            path: '/boostshare/basicData/baseStation',
            children: []
          },
          {
            name: '公钥声明书',
            path: '/boostshare/basicData/pkStatement',
            children: []
          }
        ]
      }
      // {
      //   name: '风险监控',
      //   path: '/boostshare/risk',
      //   icon: 'sider-datasdd',
      //   children: [
      //     {
      //       name: '布控结果',
      //       path: '/boostshare/risk',
      //       children: []
      //     },
      //     {
      //       name: '风险处置',
      //       path: '/boostshare/ctrlrisk',
      //       children: []
      //     },
      //   ]
      // },
      // {
      //   name: '个人信息',
      //   path: '/boostshare/userinfo',
      //   icon: 'sider-datasdd',
      //   children: [
      //     {
      //       name: '个人信息',
      //       path: '/boostshare/userinfo',
      //       children: []
      //     },
      //     {
      //       name: '修改密码',
      //       path: '/boostshare/userpassword',
      //       children: []
      //     }
      //   ]
      // }
      // {
      //   name: '审计日志',
      //   path: '/boostshare/audit-log',
      //   icon: 'sider-auditlog'
      // }
    ]
  }
]

export default menu
