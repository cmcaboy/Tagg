import {firebase} from '../firebase';
import Expo from 'expo';
import postLogin from '../loaders/postLogin'

export const startFacebookLogin = () => {
    loading(true);
    return async (dispatch,getState) => {
        const {type,token} = await Expo.Facebook.logInWithReadPermissionsAsync('424631184639658',
            {permissions:[
                'public_profile',
                'email',
               // 'user_about_me',
                'user_photos',
               // 'user_education_history',
               // 'user_work_history',
                'user_birthday',
                'user_hometown'
        ]}
        )

        // the /me notation will refer to the userid referenced from the access token.
        if(type === 'success') {
            const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`)
            const responseData = await response.json();

            const provider = firebase.auth.FacebookAuthProvider;
            const credential = provider.credential(token);
            firebase.auth().signInWithCredential(credential)
                // Once the user is logged in, run the post login function,
                // which will setup the user's application state
                .then(() =>  postLogin(firebase.auth().currentUser.uid,token,dispatch))
                .catch(() => dispatch(failedLogin('Login Failed')));
            // Issue login with unique userid as per firebase auth
           
        } else {
            //console.log("Login Error!");
            dispatch(failedLogin('Login Failed'));
        }
        
    }
}

export const resetStore = () => ({
    type: 'RESET_STORE'
})

export const startEmailLogin = (email = "",password = "") => {
    loading(true);
    return (dispatch, getState) => {
        return firebase.auth().signInWithEmailAndPassword(email,password)
            .then((data) => {
                dispatch(login(firebase.auth().currentUser.uid));
            })
            .catch((error) => {
                firebase.auth().createUserWithEmailAndPassword(email,password)
                    .then((data) => {
                        //console.log('firebase auth: ',firebase.auth());
                        dispatch(login(firebase.auth().currentUser.uid));
                    })
                    .catch((error) => {
                        dispatch(failedLogin("Authentication Failed"));
                    })
            });
    }
}

export const failedLogin = (error) => ({
    type: 'FAILED_LOGIN',
    updates: {
        password: '',
        isLoading: false,
        error
    }
})

export const loading = (isLoading) => ({
    type: 'LOADING',
    isLoading
});
export const startLoading = () => ({
    type: 'START_LOADING',
    loggedIn: undefined
});
export const finishLoading = () => ({
    type: 'FINISH_LOADING',
    loggedIn: true
});

export const matchLoading = (matchLoading) => ({
    type: 'MATCH_LOADING',
    matchLoading
});

export const login = (uid) => ({
    type: 'LOGIN',
    isLoading: false,
    error: '',
    uid,
    loggedIn: true
});

export const startLogout = () => {
    return (dispatch) => {
        return firebase.auth().signOut()
    }
};
export const logout = () => ({
    type: 'LOGOUT'
});

export const changeEmail = (email) => ({
    type: 'CHANGE_EMAIL',
    email
});

export const changePassword = (password) => ({
    type: 'CHANGE_PASSWORD',
    password
});
