import pathToRegexp from 'path-to-regexp'
import routes from '../../config/router.config'

function getBreadcrumbNameMap(routes) {
  let breadcrumbNameMap = {}

  const flattenRoute = (routes, parentRoute) => {
    routes.forEach((route) => {
      if (route.name && route.path) {
        breadcrumbNameMap[route.path] = {
          ...route,
          parentRoute
        }
      }
      if (Array.isArray(route.routes) && route.routes) {
        flattenRoute(route.routes, route)
      }
    })
  }

  flattenRoute(routes)

  return breadcrumbNameMap
}

/**
 * 菜单解析成正则
 * @param menus
 */
function formatter(menus) {
  let formatedMenus = []
  menus.forEach((menu) => {
    // 有子菜单时，当前路径必须全匹配
    if (Array.isArray(menu.children) && menu.children.length) {
      // 路径严格匹配
      if (menu.path) {
        formatedMenus.push(pathToRegexp(menu.path))
      }

      formatedMenus = formatedMenus.concat(formatter(menu.children))
    } else if (menu.path) {
      // 路径局部匹配
      formatedMenus.push(pathToRegexp(menu.path, [], { end: false }))
    }
  })
  return formatedMenus
}

export function getNearestUrl(menu) {
  if (Array.isArray(menu) && menu.length) {
    return getNearestUrl(menu[0])
  }
  if (Array.isArray(menu.children) && menu.children.length) {
    return getNearestUrl(menu.children[0])
  }
  return menu.path
}

const UserModel = {
  namespace: 'user',

  state: {
    user: null,
    menu: [],
    menuRegs: [],
    breadcrumbNameMap: getBreadcrumbNameMap(routes),
    dics: [], // 字典
    permissions: [] // 权限
  },

  effects: {
    *fetchUser(_, { call, put }) {
      const response = {
        operId: 1,
        userName: '娄底市公安局反诈指挥部'
      }

      yield put({
        type: 'fetchAuth'
      })
      // 如果能进BoostShare就给看数据字典
      const menu = response?.menuTree || []
      // const hasBoostShare = menu.some((m) => m.path === '/boostshare')
      // if (hasBoostShare) {
      //   yield put({
      //     type: 'fetchDic'
      //   })
      // }
      yield put({
        type: 'saveUser',
        payload: response
      })

      yield put({
        type: 'saveMenu',
        payload: menu
      })
      yield put({
        type: 'saveMenuRegs',
        payload: formatter(menu)
      })
    },
    *fetchAuth(_, { call, put }) {
      const response = []

      yield put({
        type: 'saveAuth',
        payload: response
      })
    }
  },

  reducers: {
    saveUser(state, { payload: user }) {
      return {
        ...state,
        user: {
          ...state.user,
          ...user
        }
      }
    },
    saveMenu(state, { payload: menu }) {
      return {
        ...state,
        menu
      }
    },
    saveMenuRegs(state, { payload: menuRegs }) {
      return {
        ...state,
        menuRegs
      }
    },
    saveDic(state, { payload: dics }) {
      state.dics = dics
    },
    saveAuth(state, { payload: permissions }) {
      state.permissions = permissions || []
    }
  }
}

export default UserModel
