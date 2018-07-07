// Cloud functions

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Cors = require("cors");
const express = require("express");
const fileUpload = require("./src/fileUpload.js")

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

// Upload file to firebase storage
const api = express().use(Cors({ origin: true }));
  fileUpload("/picture", api);

  api.post("/picture", (req, response, next) => {
    uploadImageToStorage(req.files.file[0])
    .then(metadata => {
      response.status(200).json(metadata[0]);
      return next();
    })
    .catch(error => {
      console.error(error);
      response.status(500).json({ error });
      next();
  });
});

exports.api = functions.https.onRequest(api);

const uploadImageToStorage = file => {
  const storage = admin.storage();
  return new Promise((resolve, reject) => {
      const fileUpload = storage.bucket().file(file.originalname);
      const blobStream = fileUpload.createWriteStream({
          metadata: {
              contentType: "image/jpg"
          }
      });

      blobStream.on("error", error => reject(error));

      blobStream.on("finish", () => {
          fileUpload.getMetadata()
          .then(metadata => resolve(metadata))
          .catch(error => reject(error));
      });

  blobStream.end(file.buffer);
});
}

/*
exports.newQueue = functions.https.onRequest((req, res) => {

  const id = req.id;
  db.collection(`users`).get()
    .then((queueListData) => {
      const queueList = queueListData.data();
      const likeList = db.collection(`users/${id}/likes`)
        .then((likeListData) => {
          return likeListData.docs.map(doc => {
            const docData = doc.data();
            return {id:doc.id}
          })
        })
      const dislikeList = db.collection(`users/${id}/dislikes`)
        .then((dislikeListData) => {
          return dislikeListData.docs.map(doc => {
            const docData = doc.data();
            return {id:doc.id}
          })
        })
        const excludeList = [...likeList,...dislikeList];
        return queueList;
  })
  .catch((error) => console.log('error running query',error))
});
*/

exports.onMessageAdd = functions.firestore
  .document(`matches/{matchId}/messages/{messageId}`)
  .onCreate((event) => {
    const data = event.data.data();
    console.log('onCreate Message');
  });

exports.hellowWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.getMatches = functions.https.onRequest((req,res) => {
  const id = req.query.uid;

  // Takes in an id
  // Outputs that's id's matches
  // The matches come back with their unique id, their name, and their profile picture
  console.log('in getMatches');
  db.collection(`users`).where("active","==",1).get()
    .then((data) => {
        let userList = [];
        data.docs.forEach((doc) => {
            const userData = doc.data();
            userList[doc.id] = {
              name: userData.name,
              profilePic: userData.profilePic,
              description: userData.description,
              ancillaryPics: userData.ancillaryPics,
              school: userData.school,
              work: userData.work
            }
        });
        console.log('userList: ',userList);
        return db.collection(`users/${id}/matches`).where("active","==",1).get()
          .then((matchData) => {
            const matchList = matchData.docs.map((matchData) => {
              const match = matchData.data();
              console.log('match: ',matchData.id);
                return {
                  id:matchData.id,
                  name: userList[matchData.id].name,
                  profilePic: userList[matchData.id].profilePic,
                  matchId: match.matchId,
                  lastMessage: match.lastMessage,
                  lastUser: match.lastUser,
                  description: userList[matchData.id].description,
                  ancillaryPics: userList[matchData.id].ancillaryPics,
                  school: userList[matchData.id].school,
                  work: userList[matchData.id].work
                }
            })
            console.log('matchList: ',matchList);
            return res.send(matchList);
          })
          .catch((error) => console.log("Error writing document: ",error));
    })
    .catch((error) => console.log("Error writing document: ",error));
});

exports.getLikes = functions.https.onRequest((req,res) => {
  const id = req.query.uid;

  // Takes in an id
  // Outputs that's id's matches
  // The matches come back with their unique id, their name, and their profile picture
  console.log('Start getLikes');
  db.collection(`users`).get()
    .then((data) => {
        let userList = [];
        data.docs.forEach((doc) => {
            const userData = doc.data();
            userList[doc.id] = {
              name: userData.name,
              profilePic: userData.profilePic
            }
        });
        console.log('userList: ',userList);
        return db.collection(`users/${id}/likes`).get()
        .then((likeData) => {
          const likeList = likeData.docs.map((likeData) => {
            const like = likeData.data();
            console.log('like: ',like);
            console.log('user: ',userList[like.likedId]);
            return {
              id:like.likedId,
              name: userList[like.likedId].name,
              profilePic: userList[like.likedId].profilePic
            }
          })
          return res.send(likeList);
          })
          .catch((error) => console.log("Error writing document: ",error));
    })
    .catch((error) => console.log("Error writing document: ",error));
});

exports.getDislikes = functions.https.onRequest((req,res) => {
  const id = req.query.uid;

  // Takes in an id
  // Outputs that's id's matches
  // The matches come back with their unique id, their name, and their profile picture
  
  db.collection(`users`).get()
    .then((data) => {
        let userList = [];
        data.docs.forEach((doc) => {
            const userData = doc.data();
            userList[doc.id] = {
              name: userData.name,
              profilePic: userData.profilePic
            }
        });
        return db.collection(`users/${id}/dislikes`).get()
          .then((dislikeData) => {
            const dislikeList = dislikeData.docs.map((dislikeData) => {
              const dislike = dislikeData.data();
                return {
                  id:dislike.dislikedId,
                  name: userList[dislike.dislikedId].name,
                  profilePic: userList[dislike.dislikedId].profilePic
                }
            })
            return res.send(dislikeList);
          })
          .catch((error) => console.log("Error writing document: ",error));
    })
    .catch((error) => console.log("Error writing document: ",error));
});

exports.oldNewQueue = functions.https.onRequest((req, res) => {
 
  const id = req.query.id;

  return db.collection(`users`).get()
  .then((queueList) => {
      // Firestore document id's can be obtained with the .id property.
      const newList = queueList.docs.map(doc => {
          const docData = doc.data();
          return {
              id:doc.id,
              name: docData.name,
              profilePic: docData.profilePic
          }
      });
      return res.send(newList)
  })
  .catch((error) => console.log("Error writing document: ",error));
 
  //response.send("Hello from Firebase!");
});

// Execute after a like. check to see if the liked user also like the user.
exports.onLike = functions.firestore
  .document(`users/{userId}/likes/{likeId}`)
  .onCreate((event) => {
    const data = event.data.data();
    const userId = event.params.userId;
    const likedId = data.likedId;
    db.collection(`users/${likedId}/likes`).get()
      .then((likeList) => {
        return likeList.docs.forEach((doc) => {
          const docData = doc.data();
          if(docData.likedId === userId) {
            createMatch(userId,likedId);
          }
        });

      }) // end .then
      .catch((error) => console.log('error',error))
  });

  /*
  exports.lastMessageUpdate = functions.firestore
    .document(`matches/{matchId}/messages/{messageId}`)
    .onCreate((event) => {
      const data = event.data.data();
      const matchId = event.params.matchId;
      const lastMessage = data.text;
      const lastUser = data.name;
      console.log('matchId: ',matchId);
      console.log('lastMessage: ',lastMessage);
      console.log('lastUser: ',lastUser);

      updateLastMessage(matchId,lastMessage);
      updateLastUser(matchId,lastUser);
    })
  */

// Take the last message from the match conversation and place
// it in the user's profile under matches.

exports.putLastMessage = functions.https.onRequest((req, res) => {
  console.log('matchId: ',req.query.matchId);
  console.log('message: ',req.query.message);
  updateLastMessage(req.query.matchId,req.query.message);
});

exports.putLastName = functions.https.onRequest((req, res) => {
  console.log('matchId: ',req.query.matchId);
  console.log('name: ',req.query.name);
  updateLastUser(req.query.matchId,req.query.lastName)
});

const updateLastMessage = (matchId,lastMessage) => {
  return db.collection(`matches`).doc(`${matchId}`).get()
  .then((snapshot) => {
    const matchData = snapshot.data();
    console.log('matchData: ',matchData);
    const userA = matchData.userA;
    console.log('userA: ',userA);
    const userB = matchData.userB;
    console.log('userB: ',userB);

    const lastMessageCall = db.collection(`users/${userA}/matches`).doc(`${userB}`)
      .update({lastMessage})
    const lastMessageCall2 = db.collection(`users/${userB}/matches`).doc(`${userA}`)
      .update({lastMessage})
    return Promise.all([lastMessageCall,lastMessageCall2])
      .then(() => res.send("Update Successful"))
      .catch((e) => res.send("Update Failed: ",e))
  })
  .catch((error) => console.log('Error updating user: ',error))
}

const updateLastUser = (matchId,lastUser) => {
  return db.collection(`matches`).doc(`${matchId}`).get()
  .then((snapshot) => {
    const matchData = snapshot.data();
    console.log('matchData: ',matchData);
    const userA = matchData.userA;
    console.log('userA: ',userA);
    const userB = matchData.userB;
    console.log('userB: ',userB);

    const lastUserCall = db.collection(`users/${userA}/matches`).doc(`${userB}`)
      .update({lastUser});
    const lastUserCall2 = db.collection(`users/${userB}/matches`).doc(`${userA}`)
      .update({lastUser});
    return Promise.all([lastUserCall,lastUserCall2])
      .then(() => res.send("Update Successful"))
      .catch((e) => res.send("Update Failed: ",e))
  })
  .catch((error) => console.log('Error updating user: ',error))
}

  // If active indicator on a match gets altered, adjust the match
  // Indicators on the user's profile.
  exports.onMatchShowHide = functions.firestore
    .document(`matches/{matchId}`)
    .onUpdate((event) => {
      const newValue = event.data.data();
      const oldValue = event.data.previous.data();
      const matchId = event.params.matchId;
      if(newValue.active === 0 && oldValue.active === 1) {
        // Deactivate Matches
        db.collection(`users/${newValue.userA}/matches/`).where("matchId","==",matchId)
          .update({active:0})
        db.collection(`users/${newValue.userB}/matches/`).where("matchId","==",matchId)
          .update({active:0})
      } else if(newValue.active === 1 && oldValue.active === 0) {
        // Activate Matches
        db.collection(`users/${newValue.userA}/matches/`).where("matchId","==",matchId)
          .update({active:1})
        db.collection(`users/${newValue.userB}/matches/`).where("matchId","==",matchId)
          .update({active:1})
      }
  });

// Helper function to create a new match
const createMatch = (a,b) => {
  // create a match between userId's a and b
  
  const ref = db.collection(`matches`).doc();
  
  ref.set({
    id: ref.id,
    userA:a,
    userB:b,
    matchTime: Date.now(),
    active: 1
  });

  db.collection(`users`).doc(`${a}`).get()
    .then((snapshot) => {
      const data = snapshot.data();
      return db.collection(`users/${b}/matches`).doc(`${a}`).set({
        matchId:ref.id,
        active: 1
      })
    })
    .catch((error) => console.log('error: ',error))
  
  
  db.collection(`users`).doc(`${b}`).get()
    .then((snapshot) => {
      const data = snapshot.data();
      return db.collection(`users/${a}/matches`).doc(`${b}`).set({
        matchId:ref.id,
        active: 1
      })
    })
    .catch((error) => console.log('error: ',error))
  
  .catch((error) => console.log('error: ',error))
}


