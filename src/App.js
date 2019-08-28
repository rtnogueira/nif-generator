import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import ReactGA from 'react-ga';
import './App.css';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import themeFile from './util/theme';
import { createBrowserHistory } from "history";

// Redux
import { Provider } from 'react-redux';
import store from './store/configureStore';

// Components
import Navbar from './components/Navbar';

// Pages
import NifGenerator from './pages/NifGenerator';

const theme = createMuiTheme(themeFile);

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
            <Navbar />
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
