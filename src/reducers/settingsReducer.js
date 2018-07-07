const settingsReducerDefaultState = {
    agePreference: [18,35],     
    distance: 20,                       // distance (in miles radius)
    sendNotifications: true
};

const settingsReducer = (state = settingsReducerDefaultState,action = {}) => {
    //console.log('action: ',action);
    switch(action.type) {
        case 'SET_INITIAL_SETTINGS':
            return action.initialSettings;
        case 'LOAD_SETTINGS':
            return {...state,...action.userSettings};
        case 'CHANGE_AGE_PREFERENCE':
            return {...state,...action.updates};
        case 'CHANGE_DISTANCE':
            return {...state,...action.updates};
        case 'CHANGE_NOTIFICATION':
            return {...state,...action.updates};
        case 'RESET_STORE':
            return settingsReducerDefaultState;
        default:
            return state;
    }
}

export default settingsReducer;