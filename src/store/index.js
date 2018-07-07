import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {persistStore,persistCombineReducers} from 'redux-persist';
import {AsyncStorage} from 'react-native';
import storage from 'redux-persist/es/storage';
//import reducer from '../reducers';
import authReducer from '../reducers/auth';
import matchListReducer from '../reducers/matchListReducer';
import profileReducer from '../reducers/profileReducer';
import settingsReducer from '../reducers/settingsReducer';


const config = {
    key: 'stagg',
    storage
};

const middlewares = [thunk];

const combiReducer = persistCombineReducers(config,
    {
    authReducer,
    matchListReducer,
    profileReducer,
    settingsReducer
});

export const store = createStore(combiReducer,undefined,compose(
    applyMiddleware(...middlewares)
));
export const persistor = persistStore(store);

