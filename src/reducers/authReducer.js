import { SIGN_IN, SIGN_OUT } from '../actions/types';

const INITIAL_STATE = {
	loggedIn: null,
	userId: null
};

export default (state = INITIAL_STATE, action) => {
	switch(action.type) {
		case SIGN_IN:
			return { ...state, loggedIn: true, userId: action.payload };
		case SIGN_OUT:
			return { ...state, loggedIn: false, userId: null };
		default:
			return state;
	}
};
