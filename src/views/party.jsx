import React, { Component } from 'react';
import { connect } from 'react-redux';
import Gathering from '../views/gathering/gathering';
import Details from '../views/details/details';
import Setting from '../views/setting/setting';
import Description from '../views/description/description';
import { setStyle } from '../ultils/tools';

class Party extends Component {
  hide = (obj) => {
    setStyle(this[obj], { left: '100%' });
    setStyle(this.gathering, { left: 0 });
  };
  show = (obj) => {
    setStyle(this[obj], { left: 0 });
    setStyle(this.gathering, { left: '-100%' });
  };
  touchStart = (e) => {
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
  };
  touchMove = (e) => {
    this.endX = e.touches[0].clientX;
    this.endY = e.touches[0].clientY;
  };
  touchEnd = (e, obj) => {
    const distanceX = this.endX - this.startX;
    const distanceY = this.endY - this.startY;
    if (Math.abs(distanceX) > Math.abs(distanceY) && distanceX > 0) {
      e.preventDefault();
      this.hide(obj);
    }
  };

  render() {
    return (
      <div className="app">
        <div className="gathering" ref={(ref) => { this.gathering = ref; }}>
          <Gathering
            showDetails={() => { this.show('details'); }}
            showSetting={() => { this.show('setting'); }}
            showDescription={() => { this.show('description'); }}
          />
        </div>
        <div
          className="details"
          ref={(ref) => { this.details = ref; }}
          onTouchStart={this.touchStart}
          onTouchMove={this.touchMove}
          onTouchEnd={(e) => { this.touchEnd(e, 'details'); }}
        >
          <Details hideDetails={() => { this.hide('details'); }} />
        </div>
        <div
          className="setting"
          ref={(ref) => { this.setting = ref; }}
          onTouchStart={this.touchStart}
          onTouchMove={this.touchMove}
          onTouchEnd={(e) => { this.touchEnd(e, 'setting'); }}
        >
          <Setting hideSetting={() => { this.hide('setting'); }} />
        </div>
        <div
          className="description"
          ref={(ref) => { this.description = ref; }}
          onTouchStart={this.touchStart}
          onTouchMove={this.touchMove}
          onTouchEnd={(e) => { this.touchEnd(e, 'description'); }}
        >
          <Description hideDescription={() => { this.hide('description'); }} />
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

export default connect(mapStateToProps)(Party);
