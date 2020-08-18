// 设置dayjs中文
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

require('@/utils/iconfont-base')
require('@/utils/iconfont')

window.addEventListener('unhandledrejection', (e) => {
  // 代码更新后chunk不存在的问题
  const { reason } = e
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = pattern.test(reason?.message)
  if (isChunkLoadFailed) {
    window.location.reload()
  }
})
