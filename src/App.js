import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import themeFile from './util/theme';

// Redux
import { Provider } from 'react-redux';
import store from './store/configureStore';

// Components
import Navbar from './components/Navbar';

// Pages
import NifGenerator from './pages/NifGenerator';

const theme = createMuiTheme(themeFile);

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={ theme }>
        <Provider store={ store }>
            <HashRouter basename='/'>
              <Navbar />
              <div className='container'>
                <Switch>
                  <Route exact path='/' component={ NifGenerator } />
                  <Route component={ NifGenerator } />        
                </Switch>
              </div>
            </HashRouter>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
