/**
 * Created by dell on 2017/1/11.
 */

import React, { Component, PropTypes } from 'react';
import './header.scss';

export default class Header extends Component {
  static propTypes = {
    title: PropTypes.any,
    hasTop: PropTypes.bool,
    rightBtnTxt: PropTypes.any,
    leftBtnCallBack: PropTypes.func,
    rightBtnCallBack: PropTypes.func,
    styles: PropTypes.object,
  };
  static defaultProps = {
    title: '',
    hasTop: true,
    hasLeftBtnIcon: false,
    rightBtnTxt: '',
    styles: {},
  };

  leftBtnClick = () => {
    if (this.props.leftBtnCallBack) this.props.leftBtnCallBack();
  };

  rightBtnClick = () => {
    if (this.props.rightBtnCallBack) this.props.rightBtnCallBack();
  };

  render() {
    const {
      title, hasTop, leftBtnCallBack, rightBtnCallBack, rightBtnTxt,
    } = this.props;
    return (
      <div styleName="header" style={this.props.styles}>
        {
          hasTop ? <div styleName="top" /> : null
        }
        <div styleName="title-box">
          {
            leftBtnCallBack ?
              <i
                styleName="left-btn-icon"
                className="el-icon-arrow-left"
                onTouchEnd={this.leftBtnClick}
              /> : null
          }
          <div styleName="title">{title}</div>
          {this.props.children}
          {
            rightBtnCallBack ?
              <span
                styleName="right-btn" className={rightBtnTxt ? '' : 'el-icon-more'}
                onTouchEnd={this.rightBtnClick}
              >
                {rightBtnTxt}
              </span> : null
          }
        </div>
      </div>
    );
  }
}

