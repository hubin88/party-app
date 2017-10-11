/**
 * Created by hubin on 2017/9/6.
 */

import React, { Component, PropTypes } from 'react';
import './detail.scss';
import { dateFormat, timeDifference } from '../../ultils/tools';

export default class Detail extends Component {
  static propTypes = {
    detailData: PropTypes.object,
    payType: PropTypes.object,
    partyState: PropTypes.object,
  };
  static defaultProps = {
    payType: {
      0: '免费',
      1: '发起人请客',
      2: 'AA',
    },
    partyState: {
      1: '召集中',
      2: '关闭',
      3: '报名截止',
      4: '已结束',
    },
  };

  render() {
    const { detailData, payType, partyState } = this.props;
    const { photo } = detailData;
    return (
      <div styleName="detail" className="">
        {photo ? <div styleName="ad">
          <img src={photo[0]} style={{ width: '100%', height: 'auto' }} />
        </div> : null}
        <div styleName="content">
          <div styleName="title">
            <div styleName="logo">
              <img src={detailData.author.headPic} />
              {detailData.author.authentication ? <span styleName="authentication" /> : null}
            </div>
            <div styleName="name">
              <div>{detailData.author.name}</div>
              <div>{timeDifference(detailData.createTime)}</div>
            </div>
            <div styleName="money">
              {
                detailData.cost == 3 ? <div><span styleName="protect" />{detailData.prepayment}元/人</div> :
                  <div>{payType[detailData.cost]}</div>
              }
            </div>
          </div>
          <div styleName="theme">
            <span styleName="theme-title">{detailData.partyTopic}</span>
            <span styleName="party-state">{partyState[detailData.state]}</span>
          </div>
          <div styleName="party-content">
            <div styleName="address">{detailData.address || '地点待定'}</div>
            <div styleName="time">
              <span>{detailData.partyTime}</span>
              {detailData.endTime ?
                <span>&nbsp;报名截止时间:{dateFormat(detailData.endTime, 'MM-dd HH:mm')}</span> : null
              }
            </div>
            <div styleName="text">{detailData.keyword}</div>
          </div>
        </div>
        {detailData.content ?
          <div styleName="descripte" dangerouslySetInnerHTML={{ __html: detailData.content }} /> : null}
      </div>
    );
  }
}
