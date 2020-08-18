import dayjs from 'dayjs'

export const CronEnum = {
  EVERY_YEAR: 4,
  EVERY_MONTH: 3,
  EVERY_WEEK: 2,
  EVERY_DAY: 1,
  ONCE: 0
}

export const CronMap = {
  4: '每年',
  3: '每月',
  2: '每周',
  1: '每日',
  0: '单次'
}

// 月映射到日
const MonthToDayMap = {
  1: 31,
  2: 28,
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31
}

const WeekMap = {
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六',
  7: '星期日'
}

function range(start, end) {
  const result = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}

export function generateYear() {
  const startYear = dayjs().year()
  // 取20个
  return range(startYear, startYear + 19).map((year) => ({
    value: year.toString(),
    label: `${year}年`
  }))
}

export function generateMonth() {
  return range(1, 12).map((month) => ({
    value: month.toString(),
    label: `${month}月`
  }))
}

export function generateDay(month) {
  let days = 31
  if (month) days = MonthToDayMap[month]
  return range(1, days).map((day) => ({
    value: day.toString(),
    label: `${day}日`
  }))
}

export function generateWeek() {
  return range(1, 7).map((week) => ({
    value: week.toString(),
    label: `${WeekMap[week]}`
  }))
}

// cron parser
export const CronParser = {
  // cron <- graph
  encode: (graph) => {
    const [cronType, d] = graph
    const { second, minute, hour, date, month, week, year } = d
    switch (cronType) {
      case CronEnum.EVERY_YEAR:
        return `${second} ${minute} ${hour} ${date} ${month} ? *`
      case CronEnum.EVERY_MONTH:
        return `${second} ${minute} ${hour} ${date} * ? *`
      case CronEnum.EVERY_DAY:
        return `${second} ${minute} ${hour} * * ? *`
      case CronEnum.EVERY_WEEK:
        return `${second} ${minute} ${hour} ? * ${week} *`
      case CronEnum.ONCE:
        return `${second} ${minute} ${hour} ${date} ${month} ? ${year}`
      default:
        return ''
    }
  },
  // cron -> graph
  decode: (cron) => {
    // 格式：秒 分 时 日 月 星期 年
    cron = cron.split(' ')
    const second = cron[0]
    const minute = cron[1]
    const hour = cron[2]
    const date = cron[3]
    const month = cron[4]
    const week = cron[5]
    const year = cron[6]
    if (date === '*') {
      // 每日 0时0分0秒
      // 0 0 0 * * ? *
      return [CronEnum.EVERY_DAY, { hour, minute, second }]
    } else if (week !== '?') {
      // 每周 星期一0时0分0秒
      // 0 0 0 ? * 1 *
      return [CronEnum.EVERY_WEEK, { week, hour, minute, second }]
    } else if (month === '*') {
      // 每月 1日0时0分0秒
      // 0 0 0 1 * ? *
      return [CronEnum.EVERY_MONTH, { date, hour, minute, second }]
    } else if (year === '*') {
      // 每年 1月1日 0时0分0秒
      // 0 0 0 1 1 ? *
      return [CronEnum.EVERY_YEAR, { month, date, hour, minute, second }]
    } else {
      // 单次 2020年6月1日 0时0分0秒
      // 0 0 0 1 6 ? 2020
      return [CronEnum.ONCE, { year, month, date, hour, minute, second }]
    }
  }
}
