import { createStore } from 'redux';
import rootReducer from '../shared/state/root-reducer';

const initialState = {};

const store = createStore(
    rootReducer, 
    initialState
);

export default store;