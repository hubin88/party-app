/**
 * Created by huoban-xia on 2017/7/7.
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Input, Button, Upload, Dialog, Layout } from 'element-react';
import { browserHistory } from 'react-router';
import { setFormValue } from '../../model/action';
import Header from '../../components/header/header';
import './description.scss';
import Ueditor from '../../components/ueditor';
import { DELETE } from '../../ultils/server';
import Tips from '../../components/tip/tips';
import { POST } from '../../ultils/server';
import { dateFormat } from '../../ultils/tools';

class Description extends Component {
  static propTypes = {
    hideDescription: PropTypes.func,
    payOptions: PropTypes.array,
  };
  static defaultProps = {
    payOptions: [{
      value: 0,
      label: '免费',
    }, {
      value: 1,
      label: '我买单',
    }, {
      value: 2,
      label: 'AA',
    }, {
      value: 3,
      label: '设置费用',
    }],

  };

  constructor(props) {
    super(props);
    this.state = {
      remain: 0,
      value: '',
      content: '',
      fileList: [],
      showView: false,
    };
  }
  onChange = (key, value) => {
    const obj = { [key]: value };
    this.props.dispatch(setFormValue(obj));
    this.props.hideDescription();
  };

  back = () => {
    this.props.hideDescription();
  };
  getContent = () => {
    this.setState({
      content: window.editor.getContent(),
    });
  };

  insertHtml(url) {
    const value = `<img src=${url} class="upload-img"/>`;
    window.editor.execCommand('insertHtml', value);
  }

  handleRemove(file) {
    DELETE(`http://app.${url}/v1/file/delete?url=${file.response.data}`);
  }

  handlePreview(file) {
    this.insertHtml(file.response.data);
  }

  preview = () => {
    this.setState({
      showView: true,
    });
  };
  onSubmit = () => {
    const { appState } = this.props;
    const loginData = window.sessionStorage.getItem('loginData');
    POST(`http://app.${url}/v1/party`, {
      address: appState.address,
      costWay: this.props.payOptions.filter(item => item.label === appState.payType)[0].value,
      dentityState: appState.idCardRequired ? '1' : '0',
      description: window.editor.getContent(),
      endTime: `${dateFormat(appState.endDate)} ${dateFormat(appState.endTime, 'HH:mm:ss')}`,
      expectNum: appState.registerNumber,
      filed: appState.registerRequired ? '1' : '0',
      groupId: appState.loginData.groupId || loginData.groupId,
      hotline: appState.phone.toString(),
      images: ['string'],
      partyTime: `${dateFormat(appState.dateStart)} ${dateFormat(appState.timeStart, 'HH:mm:ss')}`,
      partyTopic: appState.theme,
      phoneNumState: appState.phoneRequired ? '1' : '0',
      prepayment: appState.money,
      sloganId: 0,
      tagId: appState.type,
      userId: appState.loginData.userId || loginData.userId,
      versionName: 'string',
    }).then((res) => {
      if (res.code === 201) {
        Tips.show('发布成功');
      } else {
        Tips.show(res.message);
      }
    });
  };

  render() {
    return (
      <div styleName="description" className="a">
        <Header title="聚会描述" />
        <div styleName="editor">
          <Ueditor id="editor" height={600} />
          <Layout.Row style={{ marginTop: '10px' }}>
            <Layout.Col span="12" style={{ textAlign: 'center' }}>
              <Button type="primary" style={{ width: '100px' }} onClick={this.preview}>预览</Button>
            </Layout.Col>
            <Layout.Col span="12" style={{ textAlign: 'center' }}>
              <Button type="primary" style={{ width: '100px' }} onClick={this.onSubmit}>发布</Button>
            </Layout.Col>
          </Layout.Row>
        </div>
        <div styleName="upload">
          <Upload
            className="upload-demo"
            action={`http://app.${url}/v1/file/upload?kind=7`}
            onPreview={file => this.handlePreview(file)}
            onRemove={file => this.handleRemove(file)}
            fileList={this.state.fileList}
            listType="picture"
            name="uploadFile"
          >
            <Button size="small" type="primary">上传图片</Button>
          </Upload>
        </div>
        {this.state.showView ?
          <Dialog
            title="预览"
            visible={this.state.showView}
            onCancel={() => this.setState({ showView: false })}
            lockScroll={false}
          >
            <Dialog.Body>
              <div dangerouslySetInnerHTML={{ __html: `${window.editor.getContent()}` }} />
            </Dialog.Body>
            <Dialog.Footer className="dialog-footer">
              <Button type="primary" onClick={() => this.setState({ showView: false })}>确定</Button>
            </Dialog.Footer>
          </Dialog> : null}
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
