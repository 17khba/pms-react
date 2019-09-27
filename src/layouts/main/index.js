import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import User from '@/views/user';
import Role from '@/views/role';
import DataMaintain from '@/views/dataMaintain';
import ModuleManage from '@/views/moduleManage';

class Main extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path="/user" component={User} />
          <Route exact path="/role" component={Role} />
          <Route exact path="/dataMaintain" component={DataMaintain} />
          <Route exact path="/moduleManage" component={ModuleManage} />
          <Redirect to="/user" />
        </Switch>
      </main>
    );
  }
}

export default Main;
