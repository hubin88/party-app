/**
 * Created by huoban-xia on 2017/7/6.
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Form, Layout, Input, DatePicker, TimePicker, Switch, Button } from 'element-react';
import { setFormValue } from '../../model/action';
import Header from '../../components/header/header';
import './setting.scss';

class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: true,
      rules: {
        phone: [
          { required: false, trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              const regTel = /(^1[34578]{1}[0-9]{9}$)/;
              if (regTel.test(value) || value === '') {
                callback();
              } else {
                callback(new Error('电话不正确'));
              }
            },
          },
        ],
      },
    };
  }

  onChange = (key, value) => {
    const obj = { [key]: value };
    this.props.dispatch(setFormValue(obj));
  };
  back = () => {
    browserHistory.push('/register');
  };
  onSubmit = () => {
    browserHistory.push('/description');
  };

  render() {
    const { appState } = this.props;
    return (
      <div styleName="setting" className="">
        <Header
          title="报名设置"
          leftBtnCallBack={this.back}
        />
        <Form labelWidth="120" rules={this.state.rules} model={appState} ref={(ref) => { this.form = ref; }}>
          <Form.Item label="主办方联系方式" prop="phone">
            <Input
              type="text"
              placeholder="请输入咨询电话"
              value={appState.phone}
              onChange={(value) => { this.onChange('phone', value); }}
            />
          </Form.Item>
          <Form.Item label="活动人数限制">
            <Input
              type="number"
              placeholder="默认无限制"
              min={0}
              value={appState.registerNumber}
              onChange={(value) => {
                if (value < 0) {
                  value = 0;
                }
                this.onChange('registerNumber', value);
              }}
            />
          </Form.Item>
          <Form.Item label="报名截止时间">
            <span style={{ marginRight: '10px' }}>活动结束前均可报名</span>
            <Switch
              value={appState.isSetRegisterEnd}
              onColor="#62C0C1"
              onChange={(value) => {
                this.onChange('isSetRegisterEnd', value);
              }}
            />
            {
              appState.isSetRegisterEnd ? null :
              <div>
                <Layout.Col span="11">
                  <DatePicker
                    value={appState.endDate}
                    placeholder="截止日期"
                    onChange={(value) => {
                      this.onChange('endDate', value);
                    }}
                    disabledDate={time => time.getTime() < Date.now() - 8.64e7}
                  />
                </Layout.Col>
                <Layout.Col span="2">&nbsp;</Layout.Col>
                <Layout.Col span="11">
                  <TimePicker
                    placeholder="截止时间"
                    value={appState.endTime}
                    onChange={(value) => {
                      this.onChange('endTime', value);
                    }}
                  />
                </Layout.Col>
              </div>
            }
          </Form.Item>
          <div styleName="cancel">报名截止之前用户可以随时取消报名</div>
          <Form.Item label="设置用户报名时的必填项" className="setting-switch">
            <Switch
              value={appState.registerRequired}
              onColor="#62C0C1"
              onChange={(value) => {
                this.onChange('registerRequired', value);
                if (!value) {
                  this.onChange('phoneRequired', false);
                  this.onChange('idCardRequired', false);
                }
              }}
            />
          </Form.Item>
          {appState.registerRequired ?
            <div className="register-required">
              <Form.Item label="姓名">
                <Switch
                  value={this.state.name}
                  onColor="#62C0C1"
                  onChange={() => {
                    this.setState({
                      name: true,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="手机号">
                <Switch
                  value={appState.phoneRequired}
                  onColor="#62C0C1"
                  onChange={(value) => {
                    this.onChange('phoneRequired', value);
                  }}
                />
              </Form.Item>
              <Form.Item label="身份证">
                <Switch
                  value={appState.idCardRequired}
                  onColor="#62C0C1"
                  onChange={(value) => {
                    this.onChange('idCardRequired', value);
                  }}
                />
              </Form.Item>
              <div styleName="tips">以上三项，必须设置费用后才能生效</div>
            </div> : null}
        </Form>
        <div styleName="primary">
          <Button type="primary" onClick={this.onSubmit}>确定</Button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    appState: state.appState,
  };
}

export default connect(mapStateToProps)(Setting);