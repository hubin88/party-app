/**
 * Created by hubin on 2017/8/1.
 */

import React, { Component, PropTypes } from 'react';
import './login.scss';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Input, Form, Button, Carousel } from 'element-react';
import { setFormValue } from '../../model/action';
import { POST } from '../../ultils/server';
import Tips from '../../components/tip/tips';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      rules:{
        userName:[
          { required: true,message: '请输入账号', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              const regTel = /(^1[34578]{1}[0-9]{9}$)/;
              if (regTel.test(value)) {
                callback();
              } else {
                callback(new Error('账号不正确'));
              }
            },
          },
        ],
        password:[
          {required:true,message:'请输入密码',trigger: 'blur'},
          {validator: (rule, value, callback) => {

            if (value.length<6) {
              callback(new Error('密码最少为6位'));
            } else {
              callback();
            }
          },}
        ]
      },
    };
  }
  onChange = (key, value) => {
    const obj = { [key]: value };
    this.props.dispatch(setFormValue(obj));
  };
  onSubmit = (e) => {
    const { appState } = this.props;
    e.preventDefault(e);
    this.form.validate((valid) => {
      if (valid) {
        POST(`http://app.${url}/v1/user/login`, {
          password: appState.password,
          phone: appState.userName,
        }).then((res) => {
          if (res.code === 200) {
            this.props.dispatch(setFormValue({ loginData: res.data }));
            window.sessionStorage.setItem('loginData', res.data);
            browserHistory.push('/register');
          } else {
            Tips.show(res.message);
          }
        });
      }else {
        return false;
      }
    });

  };

  render() {
    const { appState } = this.props;
    return (
      <div styleName="login" className="">
        <Form rules={this.state.rules} model={appState} ref={(ref) => { this.form = ref; }}>
          <Form.Item prop="userName">
            <Input
              type="text"
              placeholder="User name"
              value={appState.userName}
              onChange={value => this.onChange('userName', value)}
            />
          </Form.Item>
          <Form.Item prop="password">
            <Input
              type="password"
              placeholder="Password"
              value={appState.password}
              onChange={value => this.onChange('password', value)}
            />
          </Form.Item>
          <Form.Item>
            <div styleName="primary">
              <Button type="primary" onClick={this.onSubmit}>登陆</Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    appState: state.appState,
  };
}

export default connect(mapStateToProps)(Login);
