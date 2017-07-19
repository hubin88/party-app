import * as ActionTypes from './action-types';

export function setFormValue(data) {
  return {
    type: ActionTypes.SET_FORM_VALUE,
    data,
  };
}

export function getDetails(data) {
  return {
    type: ActionTypes.GET_DETAILS,
    data,
  };
}

export function getRegisterUser(data) {
  return {
    type: ActionTypes.GET_REGISTER_USER,
    data,
  };
}

export function getComment(data) {
  return {
    type: ActionTypes.GET_COMMENT,
    data,
  };
}