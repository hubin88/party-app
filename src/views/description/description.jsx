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
import { DELETE, POST } from '../../ultils/server';
import Tips from '../../components/tip/tips';
import { dateFormat } from '../../ultils/tools';

class Description extends Component {
  static propTypes = {
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
      showView: false,
      isSubmit: false,
    };
    this.loginData = JSON.parse(window.sessionStorage.getItem('loginData'));
  }

  onChange = (key, value) => {
    const obj = { [key]: value };
    this.props.dispatch(setFormValue(obj));
  };

  back = () => {
    browserHistory.push('/register');
  };

  insertHtml(url) {
    const value = `<img src=${url} class="upload-img"/>`;
    window.editor.execCommand('insertHtml', value);
  }

  handleRemove(file) {
    const reg = /^((http:\/\/)|(https:\/\/))?([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(\/)/;
    const fileUrl = file.response.data.replace(reg, '');
    DELETE(`${url}/v1/file/delete?url=${fileUrl}`, this.loginData.token);
  }

  handlePreview(file) {
    this.insertHtml(file.response.data);
  }

  setFileList = (fileList) => {
    this.onChange('fileList', fileList);
  };
  preview = () => {
    this.setState({
      showView: true,
    });
  };
  onChange = (key, value) => {
    const obj = { [key]: value };
    this.props.dispatch(setFormValue(obj));
  };
  resetValue = () => {
    const arrEmpty = ['theme', 'imageUrl', 'address', 'type', 'money', 'partyDescription', 'phone', 'registerNumber', 'content', 'partyId'];
    arrEmpty.forEach(item => {
      this.onChange(item, '');
    });
    const arrNull = ['dateStart', 'timeStart', 'dateEnd', 'timeEnd', 'endDate', 'endTime'];
    arrNull.forEach(item => {
      this.onChange(item, null);
    });
    const arrFalse = ['registerRequired', 'phoneRequired', 'idCardRequired'];
    arrFalse.forEach(item => {
      this.onChange(item, false);
    });
    this.onChange('isSetRegisterEnd', true);
    this.onChange('fileList', []);
    this.onChange('imageUrlList', []);
    this.onChange('payType', '免费');
  };
  onSubmit = () => {
    if (this.state.isSubmit) return false;
    this.setState({
      isSubmit: true,
    });
    const { appState } = this.props;
    const loginData = JSON.parse(window.sessionStorage.getItem('loginData'));
    POST(`${url}/v1/party`, {
      partyingId: appState.partyId,
      address: appState.address,
      costWay: this.props.payOptions.filter(item => item.label === appState.payType)[0].value,
      dentityState: appState.idCardRequired ? '1' : '0',
      description: window.editor.getContent(),
      endTime: `${dateFormat(appState.endDate)} ${dateFormat(appState.endTime, 'HH:mm:ss')}`,
      expectNum: appState.registerNumber,
      filed: appState.registerRequired ? '1' : '0',
      groupId: appState.loginData.groupId || loginData.groupId,
      hotline: appState.phone.toString(),
      images: [appState.imageUrl],
      partyTime: `${dateFormat(appState.dateStart)} ${dateFormat(appState.timeStart, 'HH:mm:ss')}`,
      partyTopic: appState.theme,
      phoneNumState: appState.phoneRequired ? '1' : '0',
      prepayment: appState.money,
      sloganId: 0,
      tagId: appState.type,
      userId: appState.loginData.userId || loginData.userId,
      versionName: 'string',
    }, this.loginData.token).then((res) => {
      if (res.code === 200 || res.code === 201) {
        Tips.show('发布成功');
        this.resetValue();
        this.setState({
          isSubmit: false,
        });
        browserHistory.push('/partylist');
      } else {
        Tips.show(res.message);
      }
    });
  };

  render() {
    const { appState } = this.props;
    return (
      <div styleName="description">
        <Header title="聚会描述" leftBtnTxt='上一步' leftBtnCallBack={this.back} />
        <div styleName="editor">
          <Ueditor id="editor" height={600} value={appState.content} />
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
            action={`${url}/v1/file/upload?kind=7`}
            headers={{ Authorization: this.loginData.token }}
            onPreview={file => this.handlePreview(file)}
            onRemove={file => this.handleRemove(file)}
            onSuccess={(response, file, fileList) => this.setFileList(fileList)}
            fileList={appState.fileList}
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
