/**
 * Created by huoban-xia on 2017/7/4.
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Input, Select, DatePicker, TimePicker, Upload } from 'element-react';
import './gathering.scss';
import Header from '../../components/header/header';
import { setFormValue } from '../../model/action';
import Tips from '../../components/tip/tips';

class Gathering extends Component {
  static propTypes = {
    showDetails: PropTypes.func,
    showSetting: PropTypes.func,
    showDescription: PropTypes.func,
  };
  static defaultProps = {
    typeOptions: [{
      value: '选项1',
      label: '黄金糕',
    }, {
      value: '选项2',
      label: '双皮奶',
    }, {
      value: '选项3',
      label: '蚵仔煎',
    }, {
      value: '选项4',
      label: '龙须面',
    }, {
      value: '选项5',
      label: '北京烤鸭',
    }],
    moneyOptions: [{
      value: '1',
      label: 'AA',
    }, {
      value: '2',
      label: '免费',
    }, {
      value: '3',
      label: '我买单',
    }, {
      value: '4',
      label: '设置费用',
    }],
    sloganOptions: [{
      value: '1',
      label: 'AA',
    }, {
      value: '2',
      label: '免费',
    }, {
      value: '3',
      label: '我买单',
    }, {
      value: '4',
      label: '设置费用',
    }],
  }

  constructor(props) {
    super(props);
    this.state = {
      dialogImageUrl: '',
      dialogVisible: false,
    };
  }

  onChange = (key, value) => {
    const obj = { [key]: value };
    // if (key === 'money' && value === '4'){
    //
    // }
    this.props.dispatch(setFormValue(obj));
  };

  handleRemove = (file, fileList) => {
    console.log(file, fileList);
  };

  handlePictureCardPreview = (file) => {
    this.setState({
      dialogImageUrl: file.url,
      dialogVisible: true,
    });
  };

  back = () => {};
  next = () => {};
  preview = () => {
    const { appState } = this.props;
    const flag = appState.type && appState.date && appState.time && appState.money;
    if (flag) {
      this.props.showDetails();
    } else {
      Tips.show('类型，时间，费用为必填项');
    }
  };

  render() {
    const { appState } = this.props;
    return (
      <div styleName="gathering">
        <Header
          title="发起聚会"
          rightBtnTxt="发布"
          leftBtnCallBack={this.back}
          rightBtnCallBack={this.next}
        >
          <span styleName="preview" onTouchEnd={this.preview}>预览</span>
        </Header>
        <div styleName="content">
          <form styleName="form">
            <div styleName="form-item">
              <div styleName="label">类型</div>
              <div styleName="value arrowRight">
                <Select
                  value={appState.type} clearable placeholder="请选择主题"
                  onChange={value => this.onChange('type', value)}
                >
                  {
                    this.props.typeOptions.map(el => <Select.Option
                      key={el.value} label={el.label}
                      value={el.value}
                    />)
                  }
                </Select>
              </div>
            </div>
            <div styleName="form-item">
              <div styleName="label">主题</div>
              <div styleName="value">
                <Input
                  type="text"
                  placeholder="请输入主题,25字以内"
                  value={appState.theme}
                  onChange={value => this.onChange('theme', value)}
                />
              </div>
            </div>
            <div styleName="form-item">
              <div styleName="label">地点</div>
              <div styleName="value">
                <Input
                  type="text"
                  placeholder="请填写聚会地点"
                  value={appState.address}
                  onChange={value => this.onChange('address', value)}
                />
              </div>
            </div>
            <div styleName="form-item">
              <div styleName="label">时间</div>
              <div styleName="value arrowRight">
                <DatePicker
                  value={appState.date}
                  placeholder="选择日期"
                  onChange={(value) => {
                    this.onChange('date', value);
                  }}
                  disabledDate={time => time.getTime() < Date.now() - 8.64e7}
                />
                <TimePicker
                  placeholder="选择时间"
                  value={appState.time}
                  onChange={(value) => {
                    this.onChange('time', value);
                  }}
                />
              </div>
            </div>
            <div styleName="form-item">
              <div styleName="label">费用</div>
              <div styleName="value arrowRight">
                <Select
                  value={appState.money} clearable placeholder="请设置聚会费用"
                  onChange={value => this.onChange('money', value)}
                >
                  {
                    this.props.moneyOptions.map(el => <Select.Option
                      key={el.value} label={el.label}
                      value={el.value}
                    />)
                  }
                </Select>
              </div>
            </div>
            <div styleName="form-item">
              <div styleName="label">报名设置</div>
              <div styleName="value arrowRight" onTouchEnd={this.props.showSetting}>
                <Input
                  type="text"
                  placeholder="选填，未设置"
                  disabled
                  value={appState.registrationSettings}
                />
              </div>
            </div>
            <div styleName="form-item">
              <div styleName="label">聚会描述</div>
              <div
                styleName="value arrowRight" className="ellipsis"
                onTouchEnd={this.props.showDescription}
              >
                <Input
                  type="text"
                  disabled
                  placeholder="选填，未设置"
                  value={appState.partyDescription}
                />
              </div>
            </div>
            <div styleName="form-item">
              <div styleName="label">聚会口号</div>
              <div styleName="value arrowRight">
                <Select
                  value={appState.partySlogan} clearable placeholder="选填，未设置"
                  onChange={value => this.onChange('partySlogan', value)}
                >
                  {
                    this.props.sloganOptions.map(el => <Select.Option
                      key={el.value} label={el.label}
                      value={el.value}
                    />)
                  }
                </Select>
              </div>
            </div>
          </form>
          <Upload
            action="//jsonplaceholder.typicode.com/posts/"
            listType="picture-card"
            onPreview={file => this.handlePictureCardPreview(file)}
            onRemove={(file, fileList) => this.handleRemove(file, fileList)}
          >
            <i className="el-icon-plus" />
          </Upload>
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
export default connect(mapStateToProps)(Gathering);