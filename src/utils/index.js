// 格式化金额 小数点保留两位 整数部分三位一段分开
// isDropZero 删去小数点后是全是0的
export function formatMoney(num, isDropZero = true) {
  const money = Number(num)
  if (isNaN(money)) {
    return isDropZero ? '0' : '0.00'
  }
  if (isDropZero) {
    return money.toLocaleString()
  }
  return money.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}

export function isEmpty(o) {
  return o === undefined || o === '' || o === null
}

export function number2chinese(str) {
  let num = parseFloat(str)
  let strOutput = '',
    strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分'
  num += '00'
  const intPos = num.indexOf('.')
  if (intPos >= 0) {
    num = num.substring(0, intPos) + num.substr(intPos + 1, 2)
  }
  strUnit = strUnit.substr(strUnit.length - num.length)
  for (let i = 0; i < num.length; i++) {
    strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1)
  }
  return strOutput
    .replace(/零角零分$/, '整')
    .replace(/零[仟佰拾]/g, '零')
    .replace(/零{2,}/g, '零')
    .replace(/零([亿|万])/g, '$1')
    .replace(/零+元/, '元')
    .replace(/亿零{0,3}万/, '亿')
    .replace(/^元/, '零元')
}
