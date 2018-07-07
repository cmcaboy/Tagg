import uuid from 'uuid';
import {db} from '../firebase';
import 'firebase/firestore';

//const db = firebase.firestore();

export const startRemoveProfile = () => {
    return async (dispatch,getState) => {
        const id = getState().authReducer.uid;
        console.log('Remove id: ',id)
        const matchList = await db.collection(`users/${id}/matches`).get()
        const list = matchList.docs.map((doc) => {
            const docData = doc.data();
            return {matchId:docData.matchId}
        });

        console.log('Match List to Remove: ',list)

        // Remove matches
        list.map((match) => {
            console.log('removing matchId: ',match.matchId)
            db.collection(`matches`).doc(`${match.matchId}`).update({active:0})
                .then(() => dispatch(removeMatch(match.matchId)))
                .catch((error) => console.log('error: ',error))
        })
        
        // Remove user profile
        db.collection(`users`).doc(`${id}`).update({active:0})
            .then(() => dispatch(removeProfile(id)))
            .catch(error => console.log('error: ',error))
    }
}

export const removeMatch = (id) => ({
    type: 'REMOVE_MATCH',
    id
})

export const removeProfile = (uid) => ({
    type: 'REMOVE_PROFILE',
    uid
})

export const loadProfile = (uid,userProfile) => ({
    type: 'LOAD_PROFILE',
    uid,
    userProfile
});

export const startLoadProfile = (uid) => {
    return (dispatch,getState) => {
        db.collection(`users`).doc(`${uid}`).get()
            .then((data) => {
                //console.log('profile: ',profile);
                const profile = data.data();
                const userProfile = {
                    name: profile.name,
                    profilePic: profile.profilePic,
                    ancillaryPics: profile.ancillaryPics,
                    age: profile.age,
                    work: profile.work,
                    school: profile.school,
                    description: profile.description,
                    gender: profile.gender
                }  
                dispatch(loadProfile(uid,userProfile))
            })
            .catch((error) => console.log("Error obtaining document: ",error));
    }
}

export const startNewUser = (newUserData) => {
    return (dispatch,getState) => {
    const {
        uid = uuid(),
        age = 25,
        name = 'Anonymous',
        work = '',
        school = '',
        description = '',
        profilePic = '',
        coords = {},
        ancillaryPics = [],
        gender = 'female',
        active = 1 // active indicator
    } = newUserData;
    const newUserObj = { uid, age, gender, name, work, school, description, profilePic, ancillaryPics, active, coords};

    db.collection("users").doc(uid).set({...newUserObj})
        .then(() => dispatch(newUser(newUserObj)))
        .catch((error) => console.log("Error writing document: ",error))
    }
}
export const newUser = (newUserData) => ({
        type: 'NEW_USER',
        newUser: {
            ...newUserData
        }
});

export const startChangeAge = (age) => {
    return (dispatch,getState) => {
        const id = getState().authReducer.uid;
        db.collection("users").doc(id).update({age})
            .then(() => dispatch(changeAge(age)))
            .catch((error) => console.log("Error writing document: ",error))
    }
}

// Change Age
export const changeAge = (age) => ({
    type: 'CHANGE_AGE',
    updates: {
        age
    }
});

export const startChangeGender = (gender) => {
    return (dispatch,getState) => {
        const id = getState().authReducer.uid;
        db.collection("users").doc(id).update({gender})
            .then(() => dispatch(changeGender(gender)))
            .catch((error) => console.log("Error writing document: ",error))
    }
}

// Change Age
export const changeGender = (gender) => ({
    type: 'CHANGE_GENDER',
    updates: {
        gender
    }
});


export const startProfilePicture = (profilePic) => {
    //console.log('profile pic update: ',profilePic)
    return (dispatch,getState) => {
        const id = getState().authReducer.uid;
        db.collection("users").doc(id).update({profilePic})
            .then(() => dispatch(changeProfilePicture(profilePic)))
            .catch((error) => console.log("Error writing document: ",error))
    }
}

export const changeProfilePicture = (profilePic) => ({
    type: 'CHANGE_PROFILE_PIC',
    updates: {
        profilePic
    }
});

export const startChangeAncillaryPictures = (urlList) => {
    return (dispatch,getState) => {
        //console.log('urlList: ',urlList);
        const id = getState().authReducer.uid;
        db.collection("users").doc(id).update({ancillaryPics:urlList})
            .then(() => dispatch(changeAncillaryPictures(urlList)))
            .catch((error) => console.log("Error writing document: ",error))
    }
}

export const changeAncillaryPictures = (urlList) => ({
    type: 'CHANGE_ANCILLARY_PICS',
    updates: {
        ancillaryPics: urlList // this is expected to be an array
    }
});

export const startChangeName = (name) => {
    return (dispatch,getState) => {
        const id = getState().authReducer.uid;
        //console.log('id: ',id);
        //console.log('current state: ',getState());
        db.collection("users").doc(id).update({name})
            .then(() => dispatch(changeName(name)))
            .catch((error) => console.log("Error writing document: ",error))
    }
}

export const changeName = (name) => ({
    type: 'CHANGE_NAME',
    updates:{
        name
    }
});

export const startChangeSchool = (school) => {
    return (dispatch,getState) => {
        const id = getState().authReducer.uid;
        db.collection("users").doc(id).update({school})
            .then(() => dispatch(changeSchool(school)))
            .catch((error) => console.log("Error writing document: ",error))
    }
}

export const changeSchool = (school) => ({
    type: 'CHANGE_SCHOOL',
    updates:{
        school
    }
});

export const startChangeWork = (work) => {
    return (dispatch,getState) => {
        const id = getState().authReducer.uid;
        db.collection("users").doc(id).update({work})
            .then(() => dispatch(changeWork(work)))
            .catch((error) => console.log("Error writing document: ",error))
    }
}

export const changeWork = (work) => ({
    type: 'CHANGE_WORK',
    updates: {
        work
    }
});

export const startChangeDescription = (description) => {
    return (dispatch,getState) => {
        const id = getState().authReducer.uid;
        db.collection("users").doc(id).update({description})
            .then(() => dispatch(changeDescription(description)))
            .catch((error) => console.log("Error writing document: ",error))
    }
}

export const changeDescription = (description) => ({
    type: 'CHANGE_DESCRIPTION',
    updates:{
        description
    }
});

export const startSetCoords = (coords) => {
    return (dispatch,getState) => {
        //console.log('coords: ',coords);
        const id = getState().authReducer.uid;
        //console.log('id: ',id);
        //console.log('state: ', getState());
        db.collection('users').doc(id).update({coords})
            .then(() => dispatch(setCoords(coords)))
            .catch((error) => console.log("Error updating coords: ",error))
    }
}

export const setCoords = (coords) => ({
    type: 'SET_COORDS',
    updates: {
        coords
    }
})
