/**
 * Created by huoban-xia on 2017/7/7.
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Input, Button } from 'element-react';
import { setFormValue } from '../../model/action';
import Header from '../../components/header/header';
import './description.scss';

class Description extends Component {
  static propTypes = {
    hideDescription: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      remain: 0,
      value: '',
    };
  }

  onChange = (key, value) => {
    const obj = { [key]: value };
    this.props.dispatch(setFormValue(obj));
    this.props.hideDescription();
  };

  handleChange = (val) => {
    this.setState({
      remain: val.length,
      value: val,
    });
  };

  back = () => {
    this.props.hideDescription();
  };

  render() {
    return (
      <div styleName="description" className="">
        <Header
          title="聚会详情"
          leftBtnCallBack={this.back}
          styles={{ backgroundColor: '#62C0C1', color: 'white' }}
        />
        <div styleName="content">
          <div styleName="textarea">
            <Input
              type="textarea"
              autosize={{ minRows: 10, maxRows: 10 }}
              placeholder="简单描述一下聚会，以及对参加聚会的人的要求"
              value={this.state.value}
              onChange={(value) => { this.handleChange(value); }}
            />
            <div styleName="remain">{this.state.remain}/300字</div>
          </div>
          <button
            styleName="sure"
            onTouchEnd={() => { this.onChange('partyDescription', this.state.value); }}
          >
            确定
          </button>
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
export default connect(mapStateToProps)(Description);
