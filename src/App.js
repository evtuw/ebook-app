import React, {PureComponent} from 'react';
import Router from './navigation';
import allReducers from '../src/reducers/index';
import AppRoot from '../components/app-root';

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {};

  render() {
    return <AppRoot router={Router} reducers={allReducers} />;
  }
}
