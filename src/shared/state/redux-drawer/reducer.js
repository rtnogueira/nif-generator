import * as actionTypes from './actionsTypes';

const initialState = {
    width: 240,
    open: false
};

function drawerReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.OPEN:
            return {
                ...state,
                open: true
            };
        case actionTypes.CLOSE:
            return {
                ...state,
                open: false
            };
        default:
            return state;
    }
}

export default drawerReducer;
