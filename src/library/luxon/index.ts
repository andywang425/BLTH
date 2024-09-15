import { DateTime, Settings } from 'luxon'

interface Duration {
  ms: number
  str: string
}

// 设置默认时区为东八区
Settings.defaultZone = 'Asia/Shanghai'

/**
 * 判断一个时间戳是否是“今天”的（该时间戳必须小于等于当前时间戳）
 *
 * 假如小时为8，分钟为 5，那么从早上08:05到下一个早上08:05被视作一天
 *
 * @param timestamp 时间戳，必须小于当前时间戳
 * @param hour 小时（0-23），默认0
 * @param minute 分钟（0-59），默认5
 */
function isTimestampToday(timestamp: number, hour: number = 0, minute: number = 5): boolean {
  const time = DateTime.fromMillis(timestamp)

  // 重新定义一天（称之为A）开始的时间（A 的昨天结束的时间）
  // A 这一天的开始时间大于等于现实里今天开始的时间
  const startOfADay = DateTime.now().set({
    hour: hour,
    minute: minute,
    second: 0,
    millisecond: 0
  })
  // 定义 A 的明天开始的时间（A 的结束的时间）
  const startOfTomorrow = startOfADay.plus({ days: 1 })
  // 定义 A 的昨天开始的时间
  const startOfYesterday = startOfADay.minus({ days: 1 })

  if (DateTime.now() >= startOfADay) {
    // 如果现在已经超过 A 的开始的时间了，那么现在是 A 的今天，判断 time 是否位于 A 这一天
    // 如果是，那么现在和 time 在同一天，可以认为 time 是相对于现在的今天
    return time >= startOfADay && time < startOfTomorrow
  } else {
    // 否则现在位于 A 的昨天，判断 time 是否位于 A 的昨天
    // 如果是，那么现在和 time 在同一天，也可以认为 time 是相对于现在的今天（虽然 time 相对于 A 是昨天）
    return time >= startOfYesterday && time < startOfADay
  }
}

/**
 * 计算现在距离下一个 hour 点 minute 分还有多久
 *
 * @param hour 小时（0-23），默认0
 * @param minute 分钟（0-59），默认5
 */
function delayToNextMoment(hour: number = 0, minute: number = 5): Duration {
  const now = DateTime.now()
  let nextTime = DateTime.local(now.year, now.month, now.day, hour, minute)

  if (now > nextTime) {
    // 如果现在已经过了 hour 点 minute 分，
    // 计算距离明天 hour 点 minute 分的时间
    nextTime = nextTime.plus({ days: 1 })
  }

  // 否则就直接算距离今天 hour 点 minute 分的时间
  const diff = nextTime.diff(now)

  return {
    // 时间戳
    ms: diff.toMillis(),
    // 便于阅读的字符串，去掉开头的0小时和0分钟
    str: diff
      .toFormat('h小时m分钟s秒')
      .replace(/^0小时/, '')
      .replace(/^0分钟/, '')
  }
}

/**
 * 判断现在是不是处在目标时间范围内
 *
 * 如果开始时间晚于结束时间，则将结束时间视为第二天的时间
 *
 * @param startHour 开始小时
 * @param startMinute 开始分钟
 * @param endHour 结束小时
 * @param endMinute 结束分钟
 */
function isNowIn(
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number
): boolean {
  const now = DateTime.now()
  const start = DateTime.local(now.year, now.month, now.day, startHour, startMinute)
  let end = DateTime.local(now.year, now.month, now.day, endHour, endMinute)

  if (start > end) {
    end = end.plus({ days: 1 })
  }

  return now >= start && now < end
}

/**
 * 获取当前时间戳（秒）
 */
function ts(): number {
  return Math.round(DateTime.now().toSeconds())
}

/**
 * 获取当前时间戳（毫秒）
 */
function tsm(): number {
  return DateTime.now().toMillis()
}

export { isTimestampToday, delayToNextMoment, isNowIn, ts, tsm }
