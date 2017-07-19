import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import * as ActionTypes from './action-types';

const initData = {
  /*
   * 详情页的所有数据
   * */
  details: {},
  registerList: [],
  commentList: [],
  /*
   * 发起聚会页面
   * */
  type: '', // 聚会类型
  theme: '', // 聚会主题
  address: '', // 聚会地址
  date: null, // 聚会开始日期
  time: null, // 聚会开始时间
  money: '', // 聚会费用
  registrationSettings: '', // 报名设置
  partyDescription: '', // 聚会描述
  partySlogan: '', // 聚会口号
  /*
   * 报名设置页面
   * */
  phone: '', // 设置咨询电话
  registerNumber: '', // 设置报名人数
  endDate: null, // 设置聚会结束日期
  endTime: null, // 设置聚会结束时间
  registerRequired: false, // 是否设置用户报名必填项
  phoneRequired: false, // 用户报名是否需要填手机号码
  idCardRequired: false, // 用户报名是否需要填身份证
};
function appState(state = initData, action) {
  switch (action.type) {
    case ActionTypes.SET_FORM_VALUE:
      return { ...state, ...action.data };
    case ActionTypes.GET_DETAILS:
      return { ...state, details: action.data };
    case ActionTypes.GET_REGISTER_USER:
      return { ...state, registerList: action.data };
    case ActionTypes.GET_COMMENT:
      return { ...state, commentList: action.data };
    default:
      return state;
  }
}

export default combineReducers({ appState, routing: routerReducer });
