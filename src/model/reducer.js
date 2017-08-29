import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import * as ActionTypes from './action-types';

const initData = {
  /*
  * 登陆页
  * */
  userName: '',
  password: '',
  loginData: '',
  /*
   * 发起活动页面
   * */
  theme: '', // 活动主题
  imageUrl: '', // 活动封面
  address: '', // 活动地址
  dateStart: null, // 活动开始日期
  timeStart: null, // 活动开始时间
  dateEnd: null, // 活动结束日期
  timeEnd: null, // 活动结束时间
  type: '', // 活动类型
  payType: '免费', // 活动费用方式
  money: '',
  partyDescription: '', // 活动描述
  /*
   * 报名设置页面
   * */
  phone: '', // 设置咨询电话
  registerNumber: '', // 设置报名人数
  isSetRegisterEnd: true, // 是否使用默认时间
  endDate: null, // 设置活动结束日期
  endTime: null, // 设置活动结束时间
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
