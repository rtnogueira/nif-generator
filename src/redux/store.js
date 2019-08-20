import { createStore, combineReducers, compose } from 'redux';

import uiReducer from './reducers/uiReducer';

const initialState = {};

const reducers = combineReducers({
    UI: uiReducer, 
});

const store = createStore(
    reducers, 
    initialState, 
    compose(
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

export default store;