import React, { Component } from 'react';
import { Link } from 'react-router-dom';

//MUI stuff
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

class Navebar extends Component {
    render() {
        return (
            <AppBar>
                <Toolbar className='nav-container'>
                    <Button color='inherit' component={ Link } to='/'>Home</Button>
                </Toolbar>
            </AppBar>
        )
    }
}

export default Navebar;
