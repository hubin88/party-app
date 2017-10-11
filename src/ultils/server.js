/**
 * Created by huoban-xia on 2017/7/11.
 */

// import 'fetch-ie8';

export function POST(url, obj,token="") {
  const postData = (typeof obj === 'object') ? JSON.stringify(obj) : obj;
  return fetch(url, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: postData,
  }).then(res => res.json()).then(rs => rs);
}

export function GET(url,token) {
  return fetch(url, {
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token,
    },
  }).then(res => res.json()).then(rs => rs);
}

export function DELETE(url,token) {
  return fetch(url, {
    method: 'delete',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token,
    },
  }).then(res => res.json()).then(rs => rs);
}

