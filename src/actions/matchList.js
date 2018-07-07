import firebase from '../firebase';
import {db} from '../firebase';
import {GOOGLE_MAPS_API_KEY} from '../variables';
import {FUNCTION_PATH} from '../variables/functions';
import {matchLoading} from '../actions/auth';

export const startLoadLists = (uid) => {
    return (dispatch,getState) => {

        console.log('load list: ',uid);

        fetch(`${FUNCTION_PATH}/getLikes?uid=${uid}`)
            .then((data) => data.json())
            .then((data) => dispatch(likeList(data)))
            .catch((error) => console.log("Error fetching Likes: ",error))

        fetch(`${FUNCTION_PATH}/getDislikes?uid=${uid}`)
            .then((data) => data.json())
            .then((data) => dispatch(dislikeList(data)))
            .catch((error) => console.log("Error fetching Dislikes: ",error))
        
        fetch(`${FUNCTION_PATH}/getMatches?uid=${uid}`)
            .then((matchListData) => matchListData.json())
            .then((matchListData) => dispatch(matchList(matchListData)))
            .catch((error) => console.log("Error fetching Matches: ",error))
    }
}

// Not currently used
export const loadLists = (initialListData) => {
    const {
        matches = [],
        likes = [],
        dislikes = [],
        queue = []
    } = initialListData;
    const initialLists = { matches, likes, dislikes, queue};

    return {
        type: 'LOAD_LISTS',
        initialLists: {
            ...initialLists
        }
    }
};

export const startUpdateLastMessage = (matchId,message) => {
// i could just pass in the matchId and the Google Cloud function can do the rest
    return (dispatch) => {
        // I am not putting the dispatch function within the fetch callback because I
        // don't want to delay the state update. This piece of info is not critial
        // to keep synced up so I can optimize performance in this setting.
        fetch(`${FUNCTION_PATH}/putLastMessage?matchId=${matchId}&message=${message}`)
            .then((response) => response.json())
            .then((response) => console.log('response from updateLastMessage: ',response))
            .catch((error) => console.log("Error from updateLastMessage: ",error))
        dispatch(updateLastMessage(matchId,message))
    }
}

export const startUpdateLastName = (matchId,name) => {
    return (dispatch) => {
        fetch(`${FUNCTION_PATH}/putLastName?matchId=${matchId}&name=${name}`)
            .then((response) => response.json())
            .then((response) => console.log('response from updateLastName: ',response))
            .catch((error) => console.log("Error from updateLastName: ",error))
        dispatch(updateLastName(matchId,name))
    }
}
export const updateLastMessage = (matchId,lastMessage) => ({
    type: 'UPDATE_LAST_MESSAGE',
    matchId,
    lastMessage
});

export const updateLastName = (matchId,lastName) => ({
    type: 'UPDATE_LAST_NAME',
    matchId,
    lastName
});

export const likeList = (likeList) => ({
    type: 'LIKE_LIST',
    likeList
});
export const dislikeList = (dislikeList) => ({
    type: 'DISLIKE_LIST',
    dislikeList
});
export const matchList = (matchList) => ({
    type: 'MATCH_LIST',
    matchList
});



export const startLike = (likedId) => {
    return (dispatch,getState) => {
        const id = getState().authReducer.uid;

        dispatch(like(likedId));
        dispatch(deQueue(likedId))

        db.collection(`users/${id}/likes`).add({likedId})
            .then(() => {})
            .catch((error) => console.log("Error writing document: ",error));
        db.collection(`users/${id}/queue`).doc(`${likedId}`).delete()
            .then(() => {})
            .catch((e) => console.log('could not remove likedId: ',likedId))
        }
}

export const like = (id) => ({
        type: 'LIKE',
        like: {
            id
        }
});

export const startDislike = (dislikedId) => {
    return (dispatch,getState) => {
        const id = getState().authReducer.uid;
        db.collection(`users/${id}/dislikes`).add({dislikedId})
            .then(() => dispatch(dislike(dislikedId)))
            .catch((error) => console.log("Error writing document: ",error));
        db.collection(`users/${id}/queue`).doc(`${dislikedId}`).delete()
            .then(() => dispatch(deQueue(dislikedId)))
            .catch((error) => console.log("Error writing document: ",error));
    }
}
export const dislike = (id) => ({
        type: 'DISLIKE',
        dislike: {
            id
        }
});

export const deQueue = (id) => ({
    type:'DEQUEUE',
    dequeue: {
        id
    }
})

export const startMatch = (matchId) => {
    return (dispatch,getState) => {
        const id = getState().authReducer.uid;
        db.collection(`users/${id}/matches`).add({matchId})
            .then(() => dispatch(match(matchId)))
            .catch((error) => console.log("Error writing document: ",error));
    }
}
export const match = (id) => ({
        type: 'MATCH',
        match: {
            id
        }
});

// Will probably move this to the backend and use an HTTP request instead
export const startNewQueue = (showLoad) => {
    // query executed via firebase cloud functions
    //console.log('in startnewQueue: ',id)
    return async (dispatch,getState) => {
        /*
        const url = `${FUNCTION_PATH}/newQueue?id=${id}`
        fetch(url)
            .then((queryList) => queryList.json())
            .then((queryList) => dispatch(newqueue(queryList)))
            .catch((error) => console.log("Error fetching endpoint: ",error))
        }
        */

        if(showLoad) {
            dispatch(matchLoading(true))
        }
         

        // Workaround to avoid nasty race condition
        // ------------------------------------------------------------------------
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
          }
        while(getState().profileReducer.name === "Anonymous"){
             await sleep(10);
        }
        // ------------------------------------------------------------------------
        
        const id = getState().authReducer.uid;
        const OppositeGender = (getState().profileReducer.gender==="male")?"female":"male";
        console.log(getState().profileReducer.coords);
        const lat = getState().profileReducer.coords.latitude;
        const lon = getState().profileReducer.coords.longitude;
        const radius = getState().settingsReducer.distance;

        const url = `${FUNCTION_PATH}/getQueue?id=${id}&lat=${lat}&lon=${lon}&OppositeGender=${OppositeGender}&radius=${radius}`;

        fetch(url)
            .then((data) => data.json())
            .then((newQueue) => {
                dispatch(newqueue(newQueue))
                dispatch(matchLoading(false))
            })
            .catch((error) => console.log("Error fetching Likes: ",error))

    }
};

export const newqueue = (newQueue) => ({
        type: 'NEW_QUEUE',
        newQueue
});


