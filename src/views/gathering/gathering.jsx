/**
 * Created by huoban-xia on 2017/7/4.
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Input,
  Form,
  Button,
  Select,
  DatePicker,
  TimePicker,
  Layout,
  Radio,
  Switch,
  Upload,
  Dialog,
} from 'element-react';
import './gathering.scss';
import { browserHistory } from 'react-router';
import { setFormValue } from '../../model/action';
import Header from '../../components/header/header';
import { GET, DELETE } from '../../ultils/server';
import { dateFormat, Dates } from '../../ultils/tools';
import Tips from '../../components/tip/tips';

class Gathering extends Component {
  static propTypes = {
    showDetails: PropTypes.func,
    showSetting: PropTypes.func,
    showDescription: PropTypes.func,
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
    // cover: {
    //   width: 150,
    //   height: 150,
    // },
  };

  constructor(props) {
    super(props);
    this.state = {
      // scale: 1.0,
      dialogVisible: false,
      // isClip: false,
      dialogImageUrl: '',
      name: true,
      typeOptions: [],
      rules: {
        theme: [
          { required: true, message: '请输入活动主题', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value.length > 25) {
                callback(new Error('活动主题不超过25个字'));
              } else {
                callback();
              }
            },
          },
        ],
        address: [
          { required: true, message: '请输入活动地址', trigger: 'blur' },
        ],
        dateStart: [
          { type: 'date', required: true, message: '请选择开始日期', trigger: 'change' },
        ],
        timeStart: [
          { type: 'date', required: true, message: '请选择开始时间', trigger: 'change' },
        ],
        dateEnd: [
          { type: 'date', required: true, message: '请选择结束日期', trigger: 'change' },
        ],
        timeEnd: [
          { type: 'date', required: true, message: '请选择结束时间', trigger: 'change' },
        ],
        type: [
          { type: 'number', required: true, message: '请选择活动类型', trigger: 'blur' },
        ],
        money: [
          { required: false, trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请设置活动费用'));
              } else {
                callback();
              }
            },
          },
        ],
        phone: [
          { required: false, trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              const regTel = /(^1[34578]{1}[0-9]{9}$)/;
              const regTel2 = /^(([0+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
              if (regTel.test(value) || regTel2.test(value) || value === '') {
                callback();
              } else {
                callback(new Error('电话不正确'));
              }
            },
          },
        ],
      },
    };
    this.loginData = JSON.parse(window.sessionStorage.getItem('loginData'));
  }

  componentWillMount() {
    const { appState } = this.props;
    GET(`${url}/v1/party/tag/list`, this.loginData.token).then((res) => {
      if (res.code === 200) {
        this.setState({
          typeOptions: res.list,
        }, () => {
          const tag = this.state.typeOptions.filter(item => item.name === appState.type)[0];
          tag && this.onChange('type', tag.tagId);
        });
      }
    });
    const pay = this.props.payOptions.filter(item => item.value === appState.payType)[0];
    pay && this.onChange('payType', pay.label);
  }

  componentDidMount() {
    const isUploadImg = document.querySelector('.el-upload-list--picture-card');
    if (isUploadImg) {
      document.querySelector('.el-upload--picture-card').style.display = "none";
    }
    // this.dx = 0;
    // this.dy = 0;
    // this.preview.onmousedown = (e) => {
    //   e.preventDefault();
    //   this.lastx = this.mousePos(e).x - this.dx;
    //   this.lasty = this.mousePos(e).y - this.dy;
    //   if (this.mousePos(e).x >= this.px && this.mousePos(e).y >= this.py && this.mousePos(e).x <= this.imgWidth + this.px && this.mousePos(e).y <= this.imgHeight + this.py) {
    //     this.isMouseDown = true;
    //     this.preview.style.cursor = 'all-scroll';
    //   }
    // };
    // this.preview.onmouseup = (e) => {
    //   e.preventDefault();
    //   this.isMouseDown = false;
    //   this.preview.style.cursor = 'auto';
    // };
    // this.preview.onmouseout = (e) => {
    //   e.preventDefault();
    //   this.isMouseDown = false;
    //   this.preview.style.cursor = 'auto';
    // };
    // this.preview.onmousemove = (e) => {
    //   e.preventDefault();
    //   if (this.isMouseDown) {
    //     this.dx = this.mousePos(e).x - this.lastx;
    //     this.dy = this.mousePos(e).y - this.lasty;
    //     this.drawImageByScale(this.state.scale, this.dx, this.dy);
    //   }
    // };
  }

  onChangeMoney = (val) => {
    const value = val.replace(/[^0-9.]/, '');
    this.onChange('money', value);
  };
  onChange = (key, value) => {
    const obj = { [key]: value };
    this.props.dispatch(setFormValue(obj));
  };
  // beforeUpload = (file) => {
  //   this.setState({
  //     dialogVisible: true,
  //   });
  //   const oFReader = new FileReader();
  //   oFReader.readAsDataURL(file);
  //   oFReader.onload = (oFREvent) => {
  //     this.paintImage(oFREvent.target.result);
  //   };
  //   const isLt4M = file.size / 1024 / 1024 < 4;
  //   return isLt4M;
  // };
  //
  // mousePos = (e) => {
  //   const pos = this.box.getBoundingClientRect();
  //   return {
  //     x: e.clientX - pos.left,
  //     y: e.clientY - pos.top,
  //   };
  // };
  // resetCanvase = () => {
  //   this.setState({
  //     scale: 1.0,
  //     isClip: false,
  //   }, () => {
  //     this.dx = 0;
  //     this.dy = 0;
  //     if (this.state.isClip) {
  //       this.initClip();
  //       this.coverPostion();
  //       this.drawCover();
  //     }
  //     this.drawImageByScale(this.state.scale, 0, 0);
  //   });
  // };
  // changeRange = (e) => {
  //   this.setState({
  //     scale: e.target.value,
  //   }, () => {
  //     this.drawImageByScale(this.state.scale, this.dx, this.dy);
  //   });
  // };
  // drawImageByScale = (scale, disx, disy) => {
  //   this.imgWidth = this.W * scale;
  //   this.imgHeight = this.H * scale;
  //   this.px = (this.preview.width - this.imgWidth) / 2 + disx;
  //   this.py = (this.preview.height - this.imgHeight) / 2 + disy;
  //   this.context.clearRect(0, 0, this.preview.width, this.preview.height);
  //   this.context.drawImage(this.img, this.px, this.py, this.imgWidth, this.imgHeight);
  //   this.imgUrl = this.preview.toDataURL();
  //   this.state.isClip && this.editImg();
  // };
  // paintImage = (url) => {
  //   this.preview.width = this.box.offsetWidth;
  //   this.preview.height = this.box.offsetHeight;
  //   this.context = this.preview.getContext('2d');
  //
  //   this.img = new Image();
  //   this.img.src = url;
  //   this.img.onload = () => {
  //     if (this.img.width < this.box.offsetWidth && this.img.height < this.box.offsetHeight) {
  //       this.imgWidth = this.img.width;
  //       this.imgHeight = this.img.height;
  //     } else {
  //       const pWidth = this.img.width / (this.img.height / this.preview.offsetHeight);
  //       const pHeight = this.img.height / (this.img.width / this.preview.offsetWidth);
  //       this.imgWidth = this.img.width > this.img.height ? this.preview.offsetWidth : pWidth;
  //       this.imgHeight = this.img.height > this.img.width ? this.preview.offsetHeight : pHeight;
  //     }
  //     this.W = this.imgWidth;
  //     this.H = this.imgHeight;
  //     // 图片的坐标
  //     this.px = (this.preview.width - this.imgWidth) / 2;
  //     this.py = (this.preview.height - this.imgHeight) / 2;
  //     this.context.drawImage(this.img, this.px, this.py, this.imgWidth, this.imgHeight);
  //     this.imgUrl = this.preview.toDataURL();
  //   };
  // };
  // initClip = () => {
  //   this.clip.width = this.box.offsetWidth;
  //   this.clip.height = this.box.offsetHeight;
  //   this.cx = (this.clip.width - this.props.cover.width) / 2;
  //   this.cy = (this.clip.height - this.props.cover.height) / 2;
  // };
  // drawCover = () => {
  //   this.cover = this.clip.getContext('2d');
  //   this.cover.clearRect(0, 0, this.clip.width, this.clip.height);
  //   this.cover.beginPath();
  //   this.cover.fillStyle = 'rgba(0, 0, 0, 0.3)';
  //   this.cover.fillRect(0, 0, this.clip.width, this.clip.height);
  //   this.cover.beginPath();
  //   this.cover.lineWidth = 1;
  //   this.cover.strokeStyle = '#000';
  //   this.cover.fillStyle = 'rgba(255,255,255,0.5)';
  //   this.cover.strokeRect(this.cx, this.cy, this.props.cover.width, this.props.cover.height);
  //   this.cover.fillRect(this.cx, this.cy, this.props.cover.width, this.props.cover.height);
  //   this.editImg();
  // };
  // clipImg = () => {
  //   this.setState({
  //     isClip: !this.state.isClip,
  //   }, () => {
  //     if (this.state.isClip) {
  //       this.initClip();
  //       this.coverPostion();
  //       this.drawCover();
  //       this.clip.onmousedown = (e) => {
  //         e.preventDefault();
  //         this.lx = this.mousePos(e).x - this.cx;
  //         this.ly = this.mousePos(e).y - this.cy;
  //         if (this.mousePos(e).x >= this.cx && this.mousePos(e).y >= this.cy && this.mousePos(e).x <= this.props.cover.width + this.cx && this.mousePos(e).y <= this.props.cover.height + this.cy) {
  //           this.isMouseDown = true;
  //           this.clip.style.cursor = 'all-scroll';
  //         }
  //       };
  //       this.clip.onmouseup = (e) => {
  //         e.preventDefault();
  //         this.isMouseDown = false;
  //         this.clip.style.cursor = 'auto';
  //       };
  //       this.clip.onmouseout = (e) => {
  //         e.preventDefault();
  //         this.isMouseDown = false;
  //         this.clip.style.cursor = 'auto';
  //       };
  //       this.clip.onmousemove = (e) => {
  //         e.preventDefault();
  //         if (this.isMouseDown) {
  //           this.cx = this.mousePos(e).x - this.lx;
  //           this.cy = this.mousePos(e).y - this.ly;
  //           this.coverPostion();
  //           this.drawCover();
  //         }
  //       };
  //     } else {
  //       this.editCxt.clearRect(0, 0, this.props.cover.width, this.props.cover.height);
  //     }
  //   });
  // };
  // coverPostion = () => {
  //   if (this.cx <= 0) {
  //     this.cx = 0;
  //   }
  //   if (this.cx >= this.clip.width - this.props.cover.width) {
  //     this.cx = this.clip.width - this.props.cover.width;
  //   }
  //   if (this.cy <= 0) {
  //     this.cy = 0;
  //   }
  //   if (this.cy >= this.clip.height - this.props.cover.height) {
  //     this.cy = this.clip.height - this.props.cover.height;
  //   }
  //   if (this.cx <= this.px) {
  //     this.cx = this.px;
  //   }
  //   if (this.cy <= this.py) {
  //     this.cy = this.py;
  //   }
  //   if (this.cx >= this.px + this.imgWidth - this.props.cover.width) {
  //     this.cx = this.px + this.imgWidth - this.props.cover.width;
  //   }
  //   if (this.cy >= this.py + this.imgHeight - this.props.cover.height) {
  //     this.cy = this.py + this.imgHeight - this.props.cover.height;
  //   }
  // };
  // editImg = () => {
  //   this.editCxt = this.edit.getContext('2d');
  //   const img = new Image();
  //   img.src = this.imgUrl;
  //   img.onload = () => {
  //     this.editCxt.drawImage(img, this.cx, this.cy, this.props.cover.width, this.props.cover.height, 0, 0, this.props.cover.width, this.props.cover.height);
  //     this.clipImgUrl = this.edit.toDataURL();
  //   };
  // };
  // cancelClip = () => {
  //   this.context.clearRect(0, 0, this.preview.width, this.preview.height);
  //   try {this.cover.clearRect(0, 0, this.clip.width, this.clip.height)} catch (e) {}
  //   this.editCxt.clearRect(0, 0, this.props.cover.width, this.props.cover.height);
  //   this.setState({
  //     dialogVisible: false,
  //   });
  // };
  // sureClip = () => {
  //   this.setState({
  //     dialogVisible: false,
  //     isClip: false,
  //   });
  //   if (!this.addImg) {
  //     this.addImg = new Image();
  //   }
  //   try { this.imgContent.removeChild(this.addImg); } catch (e) {}
  //   this.addImg.src = this.clipImgUrl;
  //   this.imgContent.appendChild(this.addImg);
  // };
  uploadSuccess = (res, file, fileList) => {
    this.onChange('imageUrl', res.data);
    this.onChange('imageUrlList', fileList);
    document.querySelector('.el-upload--picture-card').style.display = "none";
  };
  removeImg = (file) => {
    console.log(file);
    const reg = /^((http:\/\/)|(https:\/\/))?([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(\/)/;
    const fileUrl = file.response ? file.response.data : file.url;
    const URL = fileUrl.replace(reg, '');
    DELETE(`${url}/v1/file/delete?url=${URL}`, this.loginData.token);
    document.querySelector('.el-upload--picture-card').style.display = "inline-block";
  };
  onSubmit = (e) => {
    e.preventDefault(e);
    const { appState } = this.props;
    this.form.validate((valid) => {
      if (valid) {
        const { appState } = this.props;
        const endTime = `${dateFormat(appState.endDate, 'yyyy/MM/dd')} ${dateFormat(appState.endTime, 'HH:mm:ss')}`;
        if (!appState.isSetRegisterEnd && endTime) {
          const partyTime = `${dateFormat(appState.dateStart, 'yyyy/MM/dd')} ${dateFormat(appState.timeStart, 'HH:mm:ss')}`;
          const flag1 = new Date(endTime).getTime() - new Date(partyTime).getTime();
          const flag2 = new Date(endTime).getTime() - Date.now();
          if (flag1 > 0) {
            Tips.show('报名截止时间必须早于活动开始时间');
            return false;
          }
          if (flag2 < 0) {
            Tips.show('报名截止时间必须晚于当前时间');
            return false;
          }
        }
        browserHistory.push('/description');
      } else {
        return false;
      }
    });
  };
  handlePictureCardPreview = (file) => {
    this.setState({
      dialogImageUrl: file.url,
      dialogVisible: true,
    })
  };

  render() {
    const { appState } = this.props;
    return (
      <div styleName="gathering" className="">
        <Header
          title="发布聚会"
        />
        <Form labelWidth="120" rules={this.state.rules} model={appState} ref={(ref) => { this.form = ref; }}>
          <Form.Item label="活动主题" prop="theme">
            <Input
              type="text"
              placeholder="请输入活动主题"
              value={appState.theme}
              onChange={value => this.onChange('theme', value)}
            />
          </Form.Item>
          <Form.Item label="活动封面">
            <Upload
              className=""
              action={`${url}/v1/file/upload?kind=7`}
              headers={{ Authorization: this.loginData.token }}
              showFileList={true}
              onPreview={file => this.handlePictureCardPreview(file)}
              onSuccess={(res, file, fileList) => this.uploadSuccess(res, file, fileList)}
              onRemove={(file) => this.removeImg(file)}
              fileList={appState.imageUrlList}
              name="uploadFile"
              listType="picture-card"
            ><i className="el-icon-plus avatar-uploader-icon" />
            </Upload>
          </Form.Item>
          <Form.Item label="活动地点" prop="address">
            <Input
              type="text"
              placeholder="请填写聚会地点"
              value={appState.address}
              onChange={value => this.onChange('address', value)}
            />
          </Form.Item>
          <Form.Item label="活动时间" required>
            <Layout.Col span="5">
              <Form.Item labelWidth="0" prop="dateStart">
                <DatePicker
                  value={appState.dateStart}
                  placeholder="开始日期"
                  onChange={(value) => {
                    this.onChange('dateStart', value);
                  }}
                  disabledDate={time => time.getTime() < Date.now() - 8.64e7 || time.getTime() > Dates.getThisMonthAfterSomeMonth(3).getTime()}
                />
              </Form.Item>
            </Layout.Col>
            <Layout.Col span="1">&nbsp;</Layout.Col>
            <Layout.Col span="5">
              <Form.Item labelWidth="0" prop="timeStart">
                <TimePicker
                  placeholder="开始时间"
                  value={appState.timeStart}
                  onChange={(value) => {
                    this.onChange('timeStart', value);
                  }}
                />
              </Form.Item>
            </Layout.Col>
            <Layout.Col span="2" style={{ textAlign: 'center' }}>——</Layout.Col>
            <Layout.Col span="5">
              <Form.Item labelWidth="0">
                <DatePicker
                  value={appState.dateEnd}
                  placeholder="结束日期"
                  isDisabled={!appState.dateStart}
                  onChange={(value) => {
                    this.onChange('dateEnd', value);
                  }}
                  disabledDate={time => appState.dateStart ? (time.getTime() < appState.dateStart.getTime() || time.getTime() > Dates.getThisMonthAfterSomeMonth(3).getTime()) : (time.getTime() > 0)}
                />
              </Form.Item>
            </Layout.Col>
            <Layout.Col span="1">&nbsp;</Layout.Col>
            <Layout.Col span="5">
              <Form.Item labelWidth="0">
                <TimePicker
                  placeholder="结束时间"
                  value={appState.timeEnd}
                  isDisabled={!appState.dateStart}
                  onChange={(value) => {
                    this.onChange('timeEnd', value);
                  }}
                />
              </Form.Item>
            </Layout.Col>
          </Form.Item>
          <Form.Item label="活动类型" prop="type">
            <Select
              value={appState.type} clearable placeholder="请选择活动类型"
              onChange={value => this.onChange('type', value)}
            >
              {
                this.state.typeOptions.map(el => <Select.Option
                  key={el.tagId} label={el.name}
                  value={el.tagId}
                />)
              }
            </Select>
          </Form.Item>
          <Form.Item label="活动费用">
            <Radio.Group
              value={appState.payType}
              onChange={(value) => {
                this.onChange('payType', value);
              }}
            >
              <Radio.Button value="免费" />
              <Radio.Button value="AA" />
              <Radio.Button value="我买单" />
              <Radio.Button value="设置费用" />
            </Radio.Group>
            {
              appState.payType === '设置费用' ?
                <Form.Item labelWidth="0" prop="money" style={{ display: 'inline-block', marginLeft: '10px' }}>
                  <Input
                    type="text"
                    placeholder="请输入费用"
                    value={appState.money}
                    style={{ width: '100px', }}
                    onChange={value => this.onChangeMoney(value)}
                  />
                </Form.Item> : null}
          </Form.Item>
          <Form.Item label="主办方联系方式" prop="phone">
            <Input
              type="text"
              placeholder='请输入手机号码或座机(&quot;区号-电话号码-分机号&quot;)'
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
                  <Layout.Col span="5">
                    <DatePicker
                      value={appState.endDate}
                      placeholder="截止日期"
                      onChange={(value) => {
                        this.onChange('endDate', value);
                      }}
                      disabledDate={time => appState.dateStart ? ((time.getTime() > appState.dateStart.getTime()) || (time.getTime() < Date.now() - 8.64e7)) : (time.getTime() > 0)}
                    />
                  </Layout.Col>
                  <Layout.Col span="1">&nbsp;</Layout.Col>
                  <Layout.Col span="5">
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
          <Form.Item>
            <div styleName="primary">
              <Button type="primary" onClick={this.onSubmit}>下一步</Button>
            </div>
          </Form.Item>
        </Form>
        <Dialog
          visible={this.state.dialogVisible}
          size="tiny"
          onCancel={() => this.setState({ dialogVisible: false })}
        >
          <img width="100%" src={this.state.dialogImageUrl} alt="" />
        </Dialog>
        {/*<Dialog*/}
        {/*title="提示"*/}
        {/*modal={false}*/}
        {/*visible={this.state.dialogVisible}*/}
        {/*onCancel={() => this.setState({ dialogVisible: false })}*/}
        {/*lockScroll={false}*/}
        {/*closeOnClickModal={false}*/}
        {/*>*/}
        {/*<Dialog.Body>*/}
        {/*<div styleName="preview-box" ref={(ref) => { this.box = ref; }}>*/}
        {/*<canvas styleName="preview" ref={(ref) => { this.preview = ref; }} />*/}
        {/*{*/}
        {/*this.state.isClip ?*/}
        {/*<span>*/}
        {/*<canvas styleName="clip" ref={(ref) => { this.clip = ref; }} />*/}
        {/*</span> : null*/}
        {/*}*/}
        {/*</div>*/}
        {/*<canvas styleName="edit" ref={(ref) => { this.edit = ref; }} width={150} height={150} />*/}
        {/*<div styleName="range-container">*/}
        {/*<Button onClick={this.resetCanvase} style={{ marginRight: '10px' }}>还原</Button>*/}
        {/*<span>1.0</span>*/}
        {/*<input*/}
        {/*type="range" min="1.0" max="3.0" step="0.1" value={this.state.scale}*/}
        {/*onChange={(e) => this.changeRange(e)}*/}
        {/*style={{ margin: '0 5px' }}*/}
        {/*/>*/}
        {/*<span>3.0</span>*/}
        {/*<Button onClick={this.clipImg} style={{ marginLeft: '10px' }}>{*/}
        {/*this.state.isClip ? '取消' : '裁剪'*/}
        {/*}</Button>*/}
        {/*</div>*/}
        {/*</Dialog.Body>*/}
        {/*<Dialog.Footer className="dialog-footer">*/}
        {/*<Button onClick={this.cancelClip}>取消</Button>*/}
        {/*<Button type="primary" onClick={this.sureClip}>确定</Button>*/}
        {/*</Dialog.Footer>*/}
        {/*</Dialog>*/}
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