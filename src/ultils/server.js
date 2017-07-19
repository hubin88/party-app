/**
 * Created by huoban-xia on 2017/7/11.
 */

// import 'fetch-ie8';

export function postJSON(url, obj) {
  const postData = (typeof obj === 'object') ? JSON.stringify(obj) : obj;
  return fetch(url, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: postData,
  }).then(res => res.json()).then(rs => rs);
}

export function getJSON(url) {
  return fetch(url, {
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(res => res.json()).then(rs => rs);
}

