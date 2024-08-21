import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import ReactGA from 'react-ga';
import './App.css';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core';
import themeFile from './util/theme';
import { createBrowserHistory } from "history";
import { Provider } from 'react-redux';
import store from './store/configureStore';
import { NavBar } from './components/nav-bar';
import { NifGenerator } from './pages/nif-generator/';

const theme = createTheme(themeFile);

ReactGA.initialize("UA-146599861-1");

const history = createBrowserHistory();

history.listen(location => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
});

class App extends Component {
  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <HashRouter basename='/'>
            <NavBar />
            <div className='container'>
              <Switch>
                <Route exact path='/' component={NifGenerator} />
                <Route component={NifGenerator} />
              </Switch>
            </div>
          </HashRouter>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
