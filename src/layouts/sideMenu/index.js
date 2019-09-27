import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import MenuConfig from '@/router/menuConfig';

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

class MenuNode {
  constructor(menuItem, parent = null) {
    this.key = menuItem.key || menuItem.path;
    this.parent = parent;
  }
}

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.menuTree = [];
  }

  rootSubmenuKeys = ['sub1', 'sub2'];

  state = {
    cacheOpenKeys: [],
    defaultOpenKeys: [],
    defaultSelectedKeys: [],
  };

  componentDidMount = () => {
    const history = this.props.history;

    //初始化路由表：
    this.initMenu(MenuConfig);

    //在渲染完成后需要手动执行一次此方法设置当前菜单，因为此时不会触发history的listen函数
    this.setActiveMenu(history.location);
    this.unListen = history.listen(this.setActiveMenu);
  };

  initMenu = (config, parent = null) => {
    let children, menuItem;

    for (let i = 0, len = config.length; i < len; i++) {
      menuItem = config[i];
      children = menuItem.children;

      if (children) {
        // 递归查找 parent
        this.initMenu(children, new MenuNode(menuItem, parent));
      } else {
        // 插入 leaf 节点
        this.menuTree.push(new MenuNode(menuItem, parent));
      }
    }
  };

  setCacheOpenKeys = keys => {
    this.setState({
      cacheOpenKeys: keys,
    });
  };

  initOpenKeys = currentOpenKey => {
    const cacheOpenKeys = this.state.defaultOpenKeys;

    this.setState({
      cacheOpenKeys,
      defaultOpenKeys: [],
    });
  };

  setOpenKeys = keys => {
    const cacheOpenKeys = this.state.cacheOpenKeys;

    this.setState({
      defaultOpenKeys: cacheOpenKeys,
    });
  };

  clickMenuItem = ({ item, key, keyPath, domEvent }) => {
    const openKeys = keyPath.filter(menu => {
      return menu !== key;
    });

    this.setCacheOpenKeys(openKeys);
  };

  setActiveMenu = location => {
    const { collapsed } = this.props;
    const { menuTree } = this;
    const { pathname } = location;

    let isActivePath,
      openKeys = [],
      selectedKeys,
      menu;

    for (let i = 0, len = menuTree.length; i < len; i++) {
      menu = menuTree[i];
      isActivePath = new RegExp(`^${menu.key}`).test(pathname);

      if (isActivePath) {
        selectedKeys = [menu.key];

        while (menu.parent) {
          openKeys.push(menu.parent.key);
          menu = menu.parent;
        }

        this.setState({
          cacheOpenKeys: collapsed ? openKeys : [],
          defaultOpenKeys: collapsed ? [] : openKeys,
          defaultSelectedKeys: selectedKeys,
        });

        return;
      }
    }

    this.setState({
      defaultOpenKeys: [],
      defaultSelectedKeys: [],
    });
  };

  openMenu = openKeys => {
    const latestOpenKey = openKeys.find(key => this.state.defaultOpenKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ defaultOpenKeys: openKeys });
    } else {
      this.setState({
        defaultOpenKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };

  selectMenuItem = ({ item, key, keyPath, selectedKeys }) => {
    this.setState({
      defaultSelectedKeys: [key],
    });
  };

  renderMenuItem = menuList => {
    const menu = menuList.map(item => {
      if (item.children) {
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.renderMenuItem(item.children)}
          </SubMenu>
        );
      } else {
        return (
          <MenuItem key={item.path}>
            <Link to={item.path}>{item.title}</Link>
          </MenuItem>
        );
      }
    });

    return menu;
  };

  render() {
    const { defaultOpenKeys, defaultSelectedKeys } = this.state;
    const { collapsed } = this.props;

    return (
      <Menu
        inlineCollapsed={collapsed}
        openKeys={defaultOpenKeys}
        selectedKeys={defaultSelectedKeys}
        onSelect={this.selectMenuItem}
        onOpenChange={this.openMenu}
        onClick={this.clickMenuItem}
        className="sideMenu fl"
        mode="inline"
        theme="dark"
      >
        {this.renderMenuItem(MenuConfig)}
      </Menu>
    );
  }
}

export default SideMenu;
