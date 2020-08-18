import React, { useState, useMemo } from 'react'
import { Select } from 'antd'
import { usePersistFn } from '@/hooks'
import { CronEnum, generateYear, generateMonth, generateDay, generateWeek } from './utils'
import styles from './index.less'

const Divider = <div className={styles.divider}>-</div>

const initialState = {
  year: void 0,
  month: void 0,
  date: void 0,
  week: void 0
}

const Year = generateYear()
const Month = generateMonth()
const Week = generateWeek()

// Cron 选择器
// 每年：月 日
// 每月：日
// 每周：星期
// 每日：不展示
// 单次：年 月 日
const CronSelect = (props) => {
  const { mode, value, onChange } = props

  const [dateTime, setDateTime] = useState(value || initialState)

  // props.value更新后更新dateTime
  const [prevValue, setPrevValue] = useState()
  if (value !== prevValue) {
    setDateTime(value || initialState)
    setPrevValue(value)
  }

  // mode改变 初始化日期
  const handleChange = (state) => {
    if (!('value' in props)) {
      setDateTime(state)
    }
    onChange && onChange(state)
  }
  const changePersist = usePersistFn(handleChange)
  // FIXME: mode变化 要不要触发onChange和数据更新
  // useUpdateEffect(() => {
  //   setDateTime(initialState)
  // }, [mode])

  const handleYearChange = (year) => {
    changePersist({ ...dateTime, year })
  }
  const handleMonthChange = (month) => {
    changePersist({ ...dateTime, month, date: void 0 })
  }
  const handleDateChange = (date) => {
    changePersist({ ...dateTime, date })
  }
  const handleWeekChange = (week) => {
    changePersist({ ...dateTime, week })
  }

  // 日根据月份变化 2月假设为28天
  const Date = useMemo(() => generateDay(dateTime.month), [dateTime])

  const YearSelect = (
    <Select
      key="year"
      placeholder="年"
      allowClear
      className={styles.select}
      value={dateTime.year}
      onChange={handleYearChange}
    >
      {Year.map((item) => (
        <Select.Option key={item.value} value={item.value}>
          {item.label}
        </Select.Option>
      ))}
    </Select>
  )
  const MonthSelect = (
    <Select
      key="month"
      placeholder="月"
      allowClear
      className={styles.select}
      value={dateTime.month}
      onChange={handleMonthChange}
    >
      {Month.map((item) => (
        <Select.Option key={item.value} value={item.value}>
          {item.label}
        </Select.Option>
      ))}
    </Select>
  )
  const DateSelect = (
    <Select
      key="date"
      placeholder="日"
      allowClear
      className={styles.select}
      value={dateTime.date}
      onChange={handleDateChange}
    >
      {Date.map((item) => (
        <Select.Option key={item.value} value={item.value}>
          {item.label}
        </Select.Option>
      ))}
    </Select>
  )
  const WeekSelect = (
    <Select
      key="week"
      placeholder="周"
      allowClear
      className={styles.select}
      value={dateTime.week}
      onChange={handleWeekChange}
    >
      {Week.map((item) => (
        <Select.Option key={item.value} value={item.value}>
          {item.label}
        </Select.Option>
      ))}
    </Select>
  )

  const renderSelect = () => {
    switch (mode) {
      case CronEnum.EVERY_YEAR:
        return [MonthSelect, Divider, DateSelect]
      case CronEnum.EVERY_MONTH:
        return [DateSelect]
      case CronEnum.EVERY_WEEK:
        return [WeekSelect]
      case CronEnum.ONCE:
        return [YearSelect, Divider, MonthSelect, Divider, DateSelect]
      default:
        return null
    }
  }

  return <div className={styles.cron}>{renderSelect()}</div>
}

export * from './utils'

export default CronSelect
