import {PLACEHOLDER_PHOTO} from '../variables';

const profileReducerDefaultState = {
    profilePic: PLACEHOLDER_PHOTO,     // url to profile picture
    ancillaryPics: [],  // array of up to 6 picture urls 
    name: 'Anonymous',  // Name of user
    Age: 25,            // Age of user
    work: '',           // Work of user
    school: '',         // school of user
    description: '',    // a short description of the user
    gender: 'female'      // Can be male or female
};

const profileReducer = (state = profileReducerDefaultState,action = {}) => {
    //console.log('profile reducer: ',action);
    switch(action.type) {
        case 'NEW_USER':
            return action.newUser;
        case 'CHANGE_NAME':
            return {...state,...action.updates};
        case 'CHANGE_AGE':
            return {...state,...action.updates};
        case 'CHANGE_GENDER':
            return {...state,...action.updates};
        case 'CHANGE_PROFILE_PIC':
            return {...state,...action.updates};
        case 'CHANGE_ANCILLARY_PICS':
            return {...state,...action.updates};
        case 'CHANGE_SCHOOL':
            return {...state,...action.updates};
        case 'CHANGE_WORK':
            return {...state,...action.updates};
        case 'CHANGE_DESCRIPTION':
            return {...state,...action.updates};
        case 'SET_COORDS':
            return {...state,...action.updates};
        case 'LOAD_PROFILE':
            return {...state,...action.userProfile};
        case 'RESET_STORE':
            return profileReducerDefaultState
        default:
            return state;
    }
}

export default profileReducer;