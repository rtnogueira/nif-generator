import { createStore, compose } from 'redux';
import rootReducer from '../shared/state/root-reducer';

const initialState = {};

const store = createStore(
    rootReducer, 
    initialState, 
    compose(
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

export default store;