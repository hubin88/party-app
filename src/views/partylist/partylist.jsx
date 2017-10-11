/**
 * Created by hubin on 2017/9/1.
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Pagination, Dialog } from 'element-react';
import { browserHistory } from 'react-router';
import Detail from '../detail/detail';
import { setFormValue } from '../../model/action';
import './partylist.scss';
import { GET } from '../../ultils/server';

class PartyList extends Component {
  static propTypes = {
    payType: PropTypes.object,
  };
  static defaultProps = {
    payType: {
      0: "免费",
      1: "发起人请客",
      2: "AA",
      3: "设置费用",
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      showView: false,
      columns: [
        {
          label: "活动ID",
          prop: "id",
          align: "center",
          width: 150
        },
        {
          label: "活动主题",
          prop: "theme",
          align: "center",
        },
        {
          label: "活动地址",
          prop: "address",
          align: "center",
        },
        {
          label: "活动时间",
          prop: "time",
          align: "center",
        },
        {
          label: "活动类型",
          prop: "type",
          align: "center",
          width: 150
        },
        {
          label: "活动费用",
          prop: "cost",
          align: "center",
          width: 150
        },
        {
          label: "操作",
          align: "center",
          fixed: 'right',
          render: (data) => {
            const disabledEdit=new Date(data.time).getTime()<=new Date().getTime();
            return <span>
               <Button plain={true} type="info" size="small" onClick={() => this.detaile(data.id)}>查看</Button>
               <Button plain={true} type="info" size="small" onClick={() => this.edit(data.id)} disabled={disabledEdit}>编辑</Button>
               <Button plain={true} type="info" size="small" onClick={() => this.again(data.id)}>再发一个</Button>
            </span>
          }
        }],
      data: [],
      detailData: {},
      page: {
        total: 0,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
      },
    };
    this.loginData = JSON.parse(window.sessionStorage.getItem('loginData'));
  }

  componentWillMount() {
    this.getPartyList(1, 10);
  }

  getPartyList = (currentPage, pageSize) => {
    const userid = this.loginData.userId;
    GET(`${url}/v1/party/list/with/user/${userid}?page=${currentPage}&limit=${pageSize}`, this.loginData.token).then(res => {
      if (res.code === 200) {
        const data = res.list || [];
        const totalCount = data[0] ? data[0].totalCount : 0;
        const partyList = [];
        data.forEach(item => {
          partyList.push({
            id: item.partyId,
            theme: item.partyTopic,
            address: item.address,
            time: item.partyTime,
            type: item.keyword,
            cost: item.cost === 3 ? item.prepayment : this.props.payType[item.cost],
          });
        });
        this.setState({
          data: partyList,
          page: Object.assign({ ...this.state.page }, { total: totalCount }),
        });
      }
    });
  };
  sizeChange = (size) => {
    this.setState({
      page: Object.assign({ ...this.state.page }, { pageSize: size, currentPage: 1 }),
    }, () => {
      const { page } = this.state;
      this.getPartyList(page.currentPage, page.pageSize);
    });
  };
  currentChange = (currentPage) => {
    this.setState({
      page: Object.assign({ ...this.state.page }, { currentPage: currentPage }),
    }, () => {
      const { page } = this.state;
      this.getPartyList(page.currentPage, page.pageSize);
    });
  };
  getPartyDetail = (partyid) =>
    GET(`${url}/v1/party/detail/${partyid}/user/${this.loginData.userId}`, this.loginData.token).then(res => {
      if (res.code === 200) {
        return res.data;
      }
      return null;
    });
  detaile = (partyid) => {
    this.getPartyDetail(partyid).then(res => {
      if (res) {
        this.setState({
          showView: true,
          detailData: res,
        })
      }
    });
  };
  edit = (partyid) => {
    this.getPartyDetail(partyid).then(res => {
      if (res) {
        this.setValue(res);
        this.onChange('partyId', partyid);
        browserHistory.push('/register');
      }
    });
  };
  again = (partyid) => {
    this.getPartyDetail(partyid).then(res => {
      if (res) {
        this.setValue(res);
        this.onChange('partyId', '');
        browserHistory.push('/register');
      }
    });
  };
  createParty = () => {
    this.resetValue();
    browserHistory.push('/register');
  };
  onChange = (key, value) => {
    const obj = { [key]: value };
    this.props.dispatch(setFormValue(obj));
  };
  setValue = (data) => {
    const obj = {
      theme: data.partyTopic,
      imageUrl: data.photo ? data.photo[0] : '',
      imageUrlList: data.photo ? [{ url: data.photo[0] }] : [],
      address: data.address,
      dateStart: new Date((new Date().getFullYear() + '-' + data.partyTime).replace(/-/g, "/")),
      timeStart: new Date(data.partyTime.replace(/-/g, "/")),
      type: data.keyword,
      payType: data.cost,
      money: data.prepayment.toString() || '',
      phone: data.phoneNum||'',
      registerNumber: data.limitationNUm,
      isSetRegisterEnd: !data.endTime,
      endDate: data.endTime ? new Date(data.endTime.replace(/-/g, "/")) : null,
      endTime: data.endTime ? new Date(data.endTime.replace(/-/g, "/")) : null,
      registerRequired: data.dentityState === 1 || data.phoneNumState === 1,
      phoneRequired: data.phoneNumState === 1,
      idCardRequired: data.dentityState === 1,
      content:data.content,
    };
    for (let key in obj) {
      this.onChange(key, obj[key]);
    }
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

  render() {
    return (
      <div styleName="partylist">
        <Table
          style={{ width: '95%', margin: '0 auto' }}
          columns={this.state.columns}
          data={this.state.data}
          border={true}
        />
        <div styleName="page">
          <Pagination layout="total, sizes, prev, pager, next, jumper" {...this.state.page}
                      onSizeChange={(size) => this.sizeChange(size)}
                      onCurrentChange={(currentPage) => this.currentChange(currentPage)} />
        </div>
        <div styleName="btn">
          <Button type="primary" onClick={() => this.createParty()}>发布新聚会</Button>
        </div>
        {this.state.showView ?
          <Dialog
            title="预览"
            size="tiny"
            visible={this.state.showView}
            onCancel={() => this.setState({ showView: false })}
            lockScroll={false}
            style={{ fontSize: '0.12rem' }}
          >
            <Dialog.Body>
              <Detail detailData={this.state.detailData} />
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

export default connect(mapStateToProps)(PartyList);