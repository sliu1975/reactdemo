// ========= 协查事务 =========

// 案件状态
export const CaseEnum = {
  TODO: '待立案',
  DEALING: '办理中',
  FINISH: '已结案'
}

// 协查事务状态
export const InvestigationEnum = {
  REPLIED: '已回复',
  TOREPLY: '待回复',
  OUTDATE: '已过期',
  // DELETE: '',
  STOP: '已终止'
}

// 布控行动状态
export const ActEnum = {
  RUNNING: '已启用',
  SUSPENDED: '已暂停',
  STOPED: '已终止'
}

// 中国建设银行娄底分行
// 国家电网娄底分公司
// 中国电信股份有限公司娄底分公司
// 中国联通娄底分工司
// 中国移动集团娄底分公司
export const CompanyEnum = {
  BANK: '中国建设银行娄底分行',
  BANK2: '中国工商银行娄底分行',
  DIANWNANG: '国家电网娄底分公司',
  DIANXIN: '中国电信股份有限公司娄底分公司',
  LIANTONG: '中国联通娄底分公司',
  YIDONG: '中国移动集团娄底分公司'
}

// 运营商根据手机号查询
export const PhoneSearchEnum = {
  A: '开户资料',
  B: '通话记录',
  C: '短信记录',
  D: '网络记录',
  E: '当前位置信息',
  F: '历史活动轨迹',
  G: '设备串号'
}

// 运营商根据IP查询
export const IPSearchEnum = {
  A: '开户资料',
  B: '网络活动日志',
  C: '相邻IP'
}

// 运营商根据经纬度查询
export const LocationSearchEnum = {
  A: '基站编号',
  B: '活动用户信息列表'
}

// 银行根据手机号/身份证/银行卡号查询
export const BankSearchEnum = {
  A: '开户资料',
  B: '交易记录'
}

// 电网根据地址查询
export const PowerSearchEnum = {
  A: '开户资料',
  B: '用电记录'
}
