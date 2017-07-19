/**
 * Created by huoban-xia on 2017/7/5.
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import './details.scss';
import Header from '../../components/header/header';
import { dateFormat, timeDifference } from '../../ultils/tools';
import { getJSON, postJSON } from '../../ultils/server';
import { getDetails, getRegisterUser, getComment } from '../../model/action';

class Details extends Component {
  static propTypes = {
    hideDetails: PropTypes.func,
  };
  static defaultProps = {
    payType: {
      0: '免费',
      1: '发起人请客',
      2: 'AA',
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      partyState: '召集中',
      showComment: true,
      myComment: '',
    };
  }

  componentWillMount() {
    setTimeout(this.layout, 0);
    const params = this.props.params;
    if (!params) return;
    this.getJsonDetails(params.partyId, params.userId);
    this.getJsonRegisterUser(params.partyId);
    this.getJsonComment(params.partyId, params.userId);
  }

  onChange = (key, value) => {
    this.setState({
      [key]: value,
    });
  };
  getJsonDetails = (partyId, userId) => {
    const detailsUrl = `http://${URL}/v1/party/detail/${partyId}/user/${userId}`;
    getJSON(detailsUrl).then((res) => {
      if (res.code === 200) {
        const data = res.data || {};
        this.props.dispatch(getDetails(data));
      }
    });
  };
  getJsonRegisterUser = (partyId) => {
    const registerUrl = `http://${URL}/v1/party/register/list/${partyId}`;
    getJSON(registerUrl).then((res) => {
      if (res.code === 200) {
        const data = res.list || {};
        this.props.dispatch(getRegisterUser(data));
      }
    });
  };
  getJsonComment = (partyId, userId) => {
    const commentUrl = `http://${URL}/v1/comment/list/with/party/${partyId}/user/${userId}`;
    getJSON(commentUrl).then((res) => {
      if (res.code === 200) {
        const data = res.list || {};
        this.props.dispatch(getComment(data));
      }
    });
  };

  layout = () => {
    const details = this.details.getBoundingClientRect();
    let height = details.height - 66;
    if (this.state.showComment) {
      height -= 51;
    }
    this.detailsContent.setAttribute('style', `height:${height}px`);
  };
  changeShowComment = (flag) => {
    this.setState({
      showComment: flag,
    });
  };
  back = () => {
    if (this.props.hideDetails) {
      this.props.hideDetails();
    }
  };
  share = () => {

  };
  sendComment = () => {
    const obj = {
      content: this.state.myComment,
      objectId: this.props.params.partyId,
      userId: this.props.params.userId,
    };
    const url = `http://${URL}/v1/comment/party`;
    postJSON(url, obj).then((res) => {
      if (res.code === 201) {
        this.setState({
          myComment: '',
        });
        const params = this.props.params;
        if (!params) return;
        this.getJsonComment(params.partyId, params.userId);
      }
    });
  };
  renderCommentList = (item, index) => {
    return (
      <li styleName="comment-list" key={index}>
        <div styleName="userImg">
          <img src={item.author.headPic} alt="" />
        </div>
        <div>
          <div styleName="user">
            <span styleName="user-nick">{item.author.name}</span>
            <span styleName="comment-time">{timeDifference(item.latestTime)}</span>
          </div>
          <div styleName="comment-text">{item.content}</div>
        </div>
      </li>
    );
  };
  renderRegisterList = (item, index) =>
    <li styleName="comment-list" key={index}>
      <div styleName="userImg">
        <img src={item.author.headPic} alt="" />
      </div>
      <div>
        <div styleName="user">
          <span styleName="user-nick">{item.author.name}</span>
          <span styleName="comment-time">{item.registerNum}人</span>
        </div>
        <div styleName="comment-text">{dateFormat(item.createTime, 'MM-dd HH:mm')}</div>
      </div>
    </li>;
  renderPhoto = (item, index) =>
    <span key={index}>
      <img src={item} alt="" />
    </span>

  render() {
    const { appState: { details, commentList, registerList } } = this.props;
    const user = details.author || {};
    return (
      <div styleName="details" className="" ref={(ref) => { this.details = ref; }}>
        <Header
          title="聚会详情"
          leftBtnCallBack={this.back}
          rightBtnCallBack={this.share}
        />
        <div styleName="details-content" ref={(ref) => { this.detailsContent = ref; }}>
          <span style={{ position: 'fixed' }} />
          <div styleName="content">
            <div styleName="title">
              <div styleName="logo">
                <img src={user.headPic} alt="" />
              </div>
              <div styleName="name">
                <div>{user.name}</div>
                <div>{timeDifference(details.createTime)}</div>
              </div>
              {details.cost === 3 ?
                <div styleName="money">
                  <div>{details.prepayment}元/人</div>
                  <br />
                  <div styleName="protect">交易保障</div>
                </div> :
                <div styleName="money">
                  <div>{this.props.payType[details.cost]}</div>
                </div>
              }
            </div>
            <div styleName="theme">
              <span
                styleName="theme-title"
              >{`${details.keyword}${details.partyTopic ? (` • ${details.partyTopic}`) : ''}`}</span>
              <span styleName="party-state">{this.state.partyState}</span>
            </div>
            <div styleName="party-content">
              <div styleName="address">{details.address || '地点待定'}</div>
              <div styleName="time">
                <span>{details.partyTime}</span>
                {details.endTime ?
                  <span>报名截止：{dateFormat(details.endTime, 'MM-dd HH:mm')}</span> : null
                }
              </div>
              {details.content ?
                <div styleName="text" dangerouslySetInnerHTML={{ __html: details.content }} /> :
                <div styleName="text">暂无聚会描述~</div>}
              {details.photo ?
                <div styleName="photo">
                  {details.photo.map((item, index) => this.renderPhoto(item, index))}
                </div> : null}
            </div>
            {details.phoneNum ?
              <div styleName="phone">
                <a href={`tel:${details.phoneNum}`} />
              </div> : null
            }
          </div>
          <div styleName="comment">
            <div styleName="pane">
              <span
                onTouchEnd={() => { this.changeShowComment(true); }}
                styleName={this.state.showComment ? 'active' : ''}
              >评论 {details.commentNumber || 0 }</span>
              <span styleName="dividing-line">|</span>
              <span
                onTouchEnd={() => { this.changeShowComment(false); }}
                styleName={this.state.showComment ? '' : 'active'}
              >报名 {details.registerNumber || 0}</span>
              {details.limitationNUm ?
                <div styleName="register-num">限{details.limitationNUm}人报名</div> : null
              }
            </div>
            <div styleName="pane-content">
              <ul styleName="comment-content">
                {this.state.showComment ?
                  commentList.map((item, index) => this.renderCommentList(item, index)) :
                  registerList.map((item, index) => this.renderRegisterList(item, index))
                }
              </ul>
            </div>
          </div>
        </div>
        {this.state.showComment ?
          <div styleName="my-comment">
            <input
              type="text"
              styleName="my-comment-text"
              placeholder="说点什么吧..."
              value={this.state.myComment}
              onChange={e => this.onChange('myComment', e.target.value)}
            />
            <button styleName="button" onTouchEnd={this.sendComment}>发送</button>
          </div> : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    appState: state.appState,
  };
}
export default connect(mapStateToProps)(Details);