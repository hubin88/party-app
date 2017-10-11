/**
 * Created by hubin on 2017/8/2.
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setFormValue } from '../model/action';

class Ueditor extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    window.editor = UE.getEditor(this.props.id, {
      UEDITOR_HOME_URL: '/static/ueditor/',
      // 工具栏
      toolbars: [[
        'fullscreen', 'undo', 'redo', '|',
        'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
        'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
        'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
        'directionalityltr', 'directionalityrtl', 'indent', '|',
        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', 'link', '|',
        'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
        'emotion', 'pagebreak', 'template', 'background', '|',
        'horizontal', 'date', 'time', 'spechars', '|',
        'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
        'print', 'preview', 'searchreplace', 'drafts', 'help',
      ]],
      lang: 'zh-cn',
      // 字体
      fontfamily: [
        { label: '', name: 'songti', val: '宋体,SimSun' },
        { label: '', name: 'kaiti', val: '楷体,楷体_GB2312, SimKai' },
        { label: '', name: 'yahei', val: '微软雅黑,Microsoft YaHei' },
        { label: '', name: 'heiti', val: '黑体, SimHei' },
        { label: '', name: 'lishu', val: '隶书, SimLi' },
        { label: '', name: 'andaleMono', val: 'andale mono' },
        { label: '', name: 'arial', val: 'arial, helvetica,sans-serif' },
        { label: '', name: 'arialBlack', val: 'arial black,avant garde' },
        { label: '', name: 'comicSansMs', val: 'comic sans ms' },
        { label: '', name: 'impact', val: 'impact,chicago' },
        { label: '', name: 'timesNewRoman', val: 'times new roman' },
      ],
      // 字号
      fontsize: [10, 11, 12, 14, 16, 18, 20, 24, 36],
      enableAutoSave: false,
      autoHeightEnabled: false,
      initialFrameHeight: this.props.height,
      initialFrameWidth: '100%',
      readonly: this.props.disabled,
    });
    const me = this;
    editor.addListener('ready',()=>{
      const value = me.props.value ? me.props.value : '<p></p>';
      editor.setContent(value);
    });
    editor.addListener('contentchange',()=>{
      this.onChange('content',editor.getContent());
    })
  }
  onChange = (key, value) => {
    const obj = { [key]: value };
    this.props.dispatch(setFormValue(obj));
  };
  render() {
    return (
      <div id={this.props.id} name="content" />
    );
  }
}

function mapStateToProps(state) {
  return {
    appState: state.appState,
  };
}

export default connect(mapStateToProps)(Ueditor);
