import React, { Component } from 'react';
import SideMenu from './sideMenu';
import Header from './header';
import Main from './main';
import './index.less';
import { getItem, setItem } from '@/common/js/util';

const hideBar = getItem('hideBar');
const isBoolean = typeof hideBar === 'boolean';

class Layout extends Component {
  constructor(props) {
    super(props);

    this.refMenu = React.createRef();
  }

  state = {
    collapsed: isBoolean ? hideBar : false,
  };

  toggleCollapsed = () => {
    const { collapsed } = this.state;

    if (!collapsed) {
      this.refMenu.current.initOpenKeys();
    } else {
      this.refMenu.current.setOpenKeys();
    }

    this.setState({
      collapsed: !collapsed,
    });

    setItem('hideBar', !collapsed);
  };

  render() {
    const { collapsed } = this.state;
    const { history } = this.props;

    return (
      <div className="layout">
        <SideMenu ref={this.refMenu} collapsed={collapsed} history={history} />
        <section>
          <Header collapsed={collapsed} toggleCollapsed={this.toggleCollapsed} />
          <Main />
        </section>
      </div>
    );
  }
}

export default Layout;
