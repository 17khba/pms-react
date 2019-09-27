import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { getItem, removeItem, setItem } from '@/common/js/util';

class Header extends Component {
  state = {
    showBar: typeof getItem('showBar') === 'boolean' ? true : getItem('showBar'),
  };

  toggleSideBar = () => {
    const { showBar } = this.state;

    setItem('showBar', !showBar);

    this.setState({
      showBar: !showBar,
    });
  };

  handleLogout = e => {
    removeItem('qxkz_info');
    this.props.history.push('/login');

    e.preventDefault();
  };

  render() {
    const { collapsed, toggleCollapsed } = this.props;

    const barClassName = !collapsed ? 'hamburger is-active' : 'hamburger';

    return (
      <header className="head-wrap">
        <div className="icon-toggle">
          <svg
            onClick={toggleCollapsed}
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            className={barClassName}
          >
            <path
              data-v-68efea28
              d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z"
            ></path>
          </svg>
        </div>
        <a href="/#" onClick={this.handleLogout}>
          退出
        </a>
      </header>
    );
  }
}

export default withRouter(Header);
