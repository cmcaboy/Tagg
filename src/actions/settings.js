import firebase from '../firebase';
import {db} from '../firebase';

export const startInitialSettings = (initialSettingsData,uid) => {
    return (dispatch,getState) => {
        const id = uid;
        const {
            agePreference = [18,35],
            distance = 20,
            sendNotifications = true
        } = initialSettingsData;
        const initialSettings = { agePreference, distance, sendNotifications};
        db.collection("users").doc(id).update({...initialSettings})
            .then(() => {
                dispatch(initialSettings(initialSettings))
            })
            .catch((error) => console.log("Error writing document: ",error))
    }
}
export const initialSettings = (initialSettingsData) => ({
        type: 'SET_INITIAL_SETTINGS',
        initialSettings: {
            ...initialSettings
        }
});

export const startLoadSettings = (id) => {
    
    return (dispatch,getState) => {
        db.collection("users").doc(`${id}`).get()
            .then((data) => {
                const userData = data.data();
                const userSettings = {
                    distance: userData.distance,
                    agePreference: userData.agePreference,
                    sendNotifications: userData.sendNotifications
                }
                dispatch(loadSettings(id,userSettings));
            }
            )
            .catch((error) => console.log("Error in startLoadSettings: ",error))
    }
}
export const loadSettings = (id,userSettings) => ({
    type: 'LOAD_SETTINGS',
    userSettings,
    id
})

export const startChangeAgePreference = (agePreference) => {
    return (dispatch,getState) => {
        const id = getState().authReducer.uid;
        db.collection("users").doc(id).update({agePreference})
            .then(() => dispatch(changeAgePreference(agePreference)))
            .catch((error) => console.log("Error writing document: ",error))
    }
}

export const changeAgePreference = (agePreference) => ({
    type: 'CHANGE_AGE_PREFERENCE',
    updates: {
        agePreference
    }
});

export const startChangeDistance = (distance) => {
    return (dispatch,getState) => {
        const id = getState().authReducer.uid;
        db.collection("users").doc(id).update({distance})
            .then(() => dispatch(changeDistance(distance)))
            .catch((error) => console.log("Error writing document: ",error))
    }
}

export const changeDistance = (distance) => ({
    type: 'CHANGE_DISTANCE',
    updates: {
        distance
    }
});

export const startChangeNotification = (notification) => {
    return (dispatch,getState) => {
        const id = getState().authReducer.uid;
        db.collection("users").doc(id).update({notification})
            .then(() => dispatch(changeNotification(notification)))
            .catch((error) => console.log("Error writing document: ",error))
    }
}

export const changeNotification = (notification) => ({
    type: 'CHANGE_NOTIFICATION',
    updates: {
        notification
    }
});
