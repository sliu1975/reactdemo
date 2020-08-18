export const HttpReg = /^https?:/
export const PhoneReg = /^((13[0-9])|(14[5,7,9])|(15([0-3]|[5-9]))|(166)|(17[0,1,3,5,6,7,8])|(18[0-9])|(19[8|9]))\d{8}$/
export const UserNameReg = /^([0-9A-Za-z]|[\u4e00-\u9fa5]){6,20}$/
export const PwdReg = /^[a-zA-Z0-9#@!~%^&*_]{8,16}$/
export const EmailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
export const FixPhoneReg = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
export const IDCardReg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
