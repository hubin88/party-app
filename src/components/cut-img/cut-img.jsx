/**
 * Created by hubin on 2017/8/28.
 */

import React, { Component, PropTypes } from 'react';
import './cut-img.scss';
import { Button} from 'element-react';

export default class CutImg extends Component {
  static propTypes = {

  };

  constructor(props) {
    super(props);
    this.state = {
      scale: 1.0,
      isClip: false,
    };
  }

  componentDidMount() {
    this.dx = 0;
    this.dy = 0;
    this.preview.onmousedown = (e) => {
      e.preventDefault();
      this.lastx = this.mousePos(e).x - this.dx;
      this.lasty = this.mousePos(e).y - this.dy;
      if (this.mousePos(e).x >= this.px && this.mousePos(e).y >= this.py && this.mousePos(e).x <= this.imgWidth + this.px && this.mousePos(e).y <= this.imgHeight + this.py) {
        this.isMouseDown = true;
        this.preview.style.cursor = 'all-scroll';
      }
    };
    this.preview.onmouseup = (e) => {
      e.preventDefault();
      this.isMouseDown = false;
      this.preview.style.cursor = 'auto';
    };
    this.preview.onmouseout = (e) => {
      e.preventDefault();
      this.isMouseDown = false;
      this.preview.style.cursor = 'auto';
    };
    this.preview.onmousemove = (e) => {
      e.preventDefault();
      if (this.isMouseDown) {
        this.dx = this.mousePos(e).x - this.lastx;
        this.dy = this.mousePos(e).y - this.lasty;
        this.drawImageByScale(this.state.scale, this.dx, this.dy);
      }
    };
  }

  init = (file) => {
    const oFReader = new FileReader();
    oFReader.readAsDataURL(file);
    oFReader.onload = (oFREvent) => {
      this.paintImage(oFREvent.target.result);
    };
  };
  changeRange = (e) => {
    this.setState({
      scale: e.target.value,
    }, () => {
      this.drawImageByScale(this.state.scale, this.dx, this.dy);
    });
  };
  paintImage = (url) => {
    this.preview.width = this.box.offsetWidth;
    this.preview.height = this.box.offsetHeight;
    this.context = this.preview.getContext('2d');
    this.img = new Image();
    this.img.src = url;
    this.img.onload = () => {
      if (this.img.width < this.box.offsetWidth && this.img.height < this.box.offsetHeight) {
        this.imgWidth = this.img.width;
        this.imgHeight = this.img.height;
      } else {
        const pWidth = this.img.width / (this.img.height / this.preview.offsetHeight);
        const pHeight = this.img.height / (this.img.width / this.preview.offsetWidth);
        this.imgWidth = this.img.width > this.img.height ? this.preview.offsetWidth : pWidth;
        this.imgHeight = this.img.height > this.img.width ? this.preview.offsetHeight : pHeight;
      }
      this.W = this.imgWidth;
      this.H = this.imgHeight;
      // 图片的坐标
      this.px = (this.preview.width - this.imgWidth) / 2;
      this.py = (this.preview.height - this.imgHeight) / 2;
      this.context.drawImage(this.img, this.px, this.py, this.imgWidth, this.imgHeight);
      this.imgUrl = this.preview.toDataURL();
    };
  };
  mousePos = (e) => {
    const pos = this.box.getBoundingClientRect();
    return {
      x: e.clientX - pos.left,
      y: e.clientY - pos.top,
    };
  };
  drawImageByScale = (scale, disx, disy) => {
    this.imgWidth = this.W * scale;
    this.imgHeight = this.H * scale;
    this.px = (this.preview.width - this.imgWidth) / 2 + disx;
    this.py = (this.preview.height - this.imgHeight) / 2 + disy;
    this.context.clearRect(0, 0, this.preview.width, this.preview.height);
    this.context.drawImage(this.img, this.px, this.py, this.imgWidth, this.imgHeight);
    this.imgUrl = this.preview.toDataURL();
    this.state.isClip && this.editImg();
  };
  editImg = () => {
    this.editCxt = this.edit.getContext('2d');
    const img = new Image();
    img.src = this.imgUrl;
    img.onload = () => {
      this.editCxt.drawImage(img, this.cx, this.cy, this.props.cover.width, this.props.cover.height, 0, 0, this.props.cover.width, this.props.cover.height);
      this.clipImgUrl = this.edit.toDataURL();
    };
  };
  resetCanvase = () => {
    this.setState({
      scale: 1.0,
    }, () => {
      this.dx = 0;
      this.dy = 0;
      if (this.state.isClip) {
        this.initClip();
        this.coverPostion();
        this.drawCover();
      }
      this.drawImageByScale(this.state.scale, 0, 0);
    });
  };
  initClip = () => {
    this.clip.width = this.box.offsetWidth;
    this.clip.height = this.box.offsetHeight;
    this.cx = (this.clip.width - this.props.cover.width) / 2;
    this.cy = (this.clip.height - this.props.cover.height) / 2;
  };
  coverPostion = () => {
    if (this.cx <= 0) {
      this.cx = 0;
    }
    if (this.cx >= this.clip.width - this.props.cover.width) {
      this.cx = this.clip.width - this.props.cover.width;
    }
    if (this.cy <= 0) {
      this.cy = 0;
    }
    if (this.cy >= this.clip.height - this.props.cover.height) {
      this.cy = this.clip.height - this.props.cover.height;
    }
    if (this.cx <= this.px) {
      this.cx = this.px;
    }
    if (this.cy <= this.py) {
      this.cy = this.py;
    }
    if (this.cx >= this.px + this.imgWidth - this.props.cover.width) {
      this.cx = this.px + this.imgWidth - this.props.cover.width;
    }
    if (this.cy >= this.py + this.imgHeight - this.props.cover.height) {
      this.cy = this.py + this.imgHeight - this.props.cover.height;
    }
  };
  drawCover = () => {
    this.cover = this.clip.getContext('2d');
    this.cover.clearRect(0, 0, this.clip.width, this.clip.height);
    this.cover.beginPath();
    this.cover.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.cover.fillRect(0, 0, this.clip.width, this.clip.height);
    this.cover.beginPath();
    this.cover.lineWidth = 1;
    this.cover.strokeStyle = '#000';
    this.cover.fillStyle = 'rgba(255,255,255,0.5)';
    this.cover.strokeRect(this.cx, this.cy, this.props.cover.width, this.props.cover.height);
    this.cover.fillRect(this.cx, this.cy, this.props.cover.width, this.props.cover.height);
    this.editImg();
  };
  clipImg = () => {
    this.setState({
      isClip: !this.state.isClip,
    }, () => {
      if (this.state.isClip) {
        this.initClip();
        this.coverPostion();
        this.drawCover();
        this.clip.onmousedown = (e) => {
          e.preventDefault();
          this.lx = this.mousePos(e).x - this.cx;
          this.ly = this.mousePos(e).y - this.cy;
          if (this.mousePos(e).x >= this.cx && this.mousePos(e).y >= this.cy && this.mousePos(e).x <= this.props.cover.width + this.cx && this.mousePos(e).y <= this.props.cover.height + this.cy) {
            this.isMouseDown = true;
            this.clip.style.cursor = 'all-scroll';
          }
        };
        this.clip.onmouseup = (e) => {
          e.preventDefault();
          this.isMouseDown = false;
          this.clip.style.cursor = 'auto';
        };
        this.clip.onmouseout = (e) => {
          e.preventDefault();
          this.isMouseDown = false;
          this.clip.style.cursor = 'auto';
        };
        this.clip.onmousemove = (e) => {
          e.preventDefault();
          if (this.isMouseDown) {
            this.cx = this.mousePos(e).x - this.lx;
            this.cy = this.mousePos(e).y - this.ly;
            this.coverPostion();
            this.drawCover();
          }
        };
      } else {
        this.editCxt.clearRect(0, 0, this.props.cover.width, this.props.cover.height);
      }
    });
  };
  cancelClip = () => {
    this.context.clearRect(0, 0, this.preview.width, this.preview.height);
    this.cover.clearRect(0, 0, this.clip.width, this.clip.height);
    this.editCxt.clearRect(0, 0, this.props.cover.width, this.props.cover.height);
  };

  render() {
    return (
      <div>
        <div styleName="preview-box" ref={(ref) => { this.box = ref; }}>
          <canvas styleName="preview" ref={(ref) => { this.preview = ref; }} />
          {
            this.state.isClip ?
              <span>
                    <canvas styleName="clip" ref={(ref) => { this.clip = ref; }} />
                  </span> : null
          }
        </div>
        <canvas styleName="edit" ref={(ref) => { this.edit = ref; }} width={150} height={150} />
        <div styleName="range-container">
          <Button onClick={this.resetCanvase} style={{ marginRight: '10px' }}>还原</Button>
          <span>1.0</span>
          <input
            type="range" min="1.0" max="3.0" step="0.1" value={this.state.scale} onChange={this.changeRange}
            style={{ margin: '0 5px' }}
          />
          <span>3.0</span>
          <Button onClick={this.clipImg} style={{ marginLeft: '10px' }}>{
            this.state.isClip ? '取消' : '裁剪'
          }</Button>
        </div>
      </div>
    );
  }
}
