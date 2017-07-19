/**
 * Created by huoban-xia on 2017/7/6.
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Input, DatePicker, TimePicker, Switch } from 'element-react';
import { setFormValue } from '../../model/action';
import Header from '../../components/header/header';
import './setting.scss';

class Setting extends Component {
  static propTypes = {
    hideSetting: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      registerNumber: '',
      endDate: null,
      endTime: null,
      registerRequired: false,
      phoneRequired: false,
      idCardRequired: false,
      registrationSettings: '',
    };
  }

  onChange = () => {
    const keys = ['phone', 'registerNumber', 'endDate', 'endTime', 'registerRequired', 'phoneRequired', 'idCardRequired'];
    const obj = {};
    let flag = false;
    keys.forEach((item) => {
      obj[item] = this.state[item];
      if (obj[item]) {
        flag = true;
      }
    });
    console.log(flag);
    if (flag) {
      obj.registrationSettings = '已设置';
    } else {
      obj.registrationSettings = '';
    }
    this.props.dispatch(setFormValue(obj));
  };
  back = () => {
    this.props.hideSetting();
  };
  next = () => {
    this.onChange();
    this.props.hideSetting();
  };

  handleChange = (key, val) => {
    this.setState({
      [key]: val,
    }, () => {
      if (!this.state.registerRequired) {
        this.setState({
          phoneRequired: false,
          idCardRequired: false,
        });
      }
    });
  };

  render() {
    console.log(this.props.appState);
    return (
      <div styleName="setting" className="">
        <Header
          title="聚会详情"
          leftBtnCallBack={this.back}
          rightBtnCallBack={this.next}
        />
        <div styleName="content">
          <form styleName="form">
            <div styleName="form-item">
              <div styleName="label">咨询电话</div>
              <div styleName="value">
                <Input
                  type="text"
                  placeholder="请输入咨询电话"
                  value={this.state.phone}
                  onChange={value => this.handleChange('phone', value)}
                />
              </div>
            </div>
            <div styleName="form-item">
              <div styleName="label">人数限制</div>
              <div styleName="value">
                <Input
                  type="text"
                  placeholder="默认无限制"
                  value={this.state.registerNumber}
                  onChange={value => this.handleChange('registerNumber', value)}
                />
              </div>
            </div>
            <div styleName="form-item no-border">
              <div styleName="label">截止时间</div>
              <div styleName="value">
                <DatePicker
                  value={this.state.endDate}
                  placeholder="选择日期"
                  onChange={(value) => {
                    this.handleChange('endDate', value);
                  }}
                  disabledDate={time => time.getTime() < Date.now() - 8.64e7}
                />
                <TimePicker
                  placeholder="选择时间"
                  value={this.state.endTime}
                  onChange={(value) => {
                    this.handleChange('endTime', value);
                  }}
                />
              </div>
            </div>
          </form>
          <div styleName="cancel">报名截止之前用户可以随时取消报名</div>
          <form styleName="form">
            <div styleName="form-item no-border">
              <div styleName="label" style={{ width: 'auto' }}>设置用户报名时的必填项</div>
              <div styleName="value" style={{ textAlign: 'right' }}>
                <Switch
                  value={this.state.registerRequired}
                  onColor="#62C0C1"
                  onText=""
                  offText=""
                  onChange={(value) => {
                    this.handleChange('registerRequired', value);
                  }}
                />
              </div>
            </div>
          </form>
          {this.state.registerRequired ?
            <div>
              <form styleName="form" style={{ marginTop: '.1rem' }}>
                <div styleName="form-item">
                  <div styleName="label">姓名</div>
                </div>
                <div styleName="form-item">
                  <div styleName="label">手机号</div>
                  <div styleName="value">
                    <Switch
                      value={this.state.phoneRequired}
                      onColor="#62C0C1"
                      onText=""
                      offText=""
                      onChange={(value) => {
                        this.handleChange('phoneRequired', value);
                      }}
                    />
                  </div>
                </div>
                <div styleName="form-item no-border">
                  <div styleName="label">身份证</div>
                  <div styleName="value">
                    <Switch
                      value={this.state.idCardRequired}
                      onColor="#62C0C1"
                      onText=""
                      offText=""
                      onChange={(value) => {
                        this.handleChange('idCardRequired', value);
                      }}
                    />
                  </div>
                </div>
              </form>
              <div styleName="tips">以上三项，必须设置费用后才能生效</div>
            </div> : null}
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