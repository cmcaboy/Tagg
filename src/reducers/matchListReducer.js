const matchListReducerDefaultState = {
    matches: [],    // id list of matches
    likes: [],      // id list of likes
    dislikes: [],   // id list of dislikes
    queue: []    // object list of potential matches, which includes pic, name, description, and anything else required for a render
};

const matchListReducer = (state = matchListReducerDefaultState,action = {}) => {
    console.log(action.type);
    switch(action.type) {
        case 'LOAD_LISTS':
            return {
                ...action.initialLists
            };
        case 'LIKE_LIST':
            return {
                ...state,
                likes: action.likeList
            };
        case 'DISLIKE_LIST':
            return {
                ...state,
                dislikes: action.dislikeList
            };
        case 'MATCH_LIST':
            return {
                ...state,
                matches: action.matchList
            };
        case 'LIKE':
            // remove entry from queue list
            // add entry to like list
            return {
                ...state,
                //queue: state.queue.filter(element => element.id !== action.like.id),
                likes: [...state.likes, action.like.id]
            };
        case 'DISLIKE':
            // remove entry from queue list
            // add entry to dislike list
            return {
                ...state,
                //queue: state.queue.filter(element => element.id !== action.dislike.id),
                dislikes: [...state.dislikes, action.dislike.id]
            };
        case 'DEQUEUE':
            // remove entry from queue list
            // add entry to dislike list
            return {
                ...state,
                queue: state.queue.filter(element => element.id !== action.dequeue.id),
            };
        case 'MATCH':
            // remove entry from queue list
            // add entry to match
            return {
                ...state,
                queue: state.queue.filter(element => element.id !== action.match.id),
                matches: [...state.matches, action.match.id]
            };
        case 'REMOVE_MATCH':
            return {
                ...state,
                matches: state.matches.filter(match => match.id !== action.id)
            }
        case 'REQUEUE':
            // Append new potential matches
            return {
                ...state,
                queue: [...state.queue,...action.newQueue]
            };
        case 'NEW_QUEUE':
            // Fill queue with new list
            return {
                ...state,
                queue: [...action.newQueue]
            };
        case 'UPDATE_LAST_NAME':
            return {
                ...state,
                matches: state.matches.map(match => {
                        if(match.matchId === action.matchId) {
                            return {...match,lastName:action.lastName}
                        } else {
                            return match;
                        }
                    })
                };
        case 'UPDATE_LAST_MESSAGE':
            return {
                ...state,
                matches: state.matches.map(match => {
                    if(match.matchId === action.matchId) {
                        return {...match,lastMessage:action.lastMessage}
                    } else {
                        return match;
                    }
                })
            }
        case 'RESET_STORE':
            return matchListReducerDefaultState;
        default:
            return state;
    } // ends switch
} // Ends matchListReducer

export default matchListReducer;