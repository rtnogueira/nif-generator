
import { combineReducers } from 'redux';
import { reducer as drawer } from '../redux-drawer';

const rootReducer = combineReducers({
    drawer
});

export default rootReducer;
