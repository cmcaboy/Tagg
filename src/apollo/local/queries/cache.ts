import gql from 'graphql-tag';

export const updateQueue = (store, data) => {
  console.log('data: ', data);
  console.log('store: ', store);

  const fragment = gql`
    fragment Queue on Queue {
      list {
        id
        name
        pics
        age
        description
        work
        school
        distanceApart
        order
        profilePic
        isFollowing
        hasDateOpen
      }
      cursor
      id
    }
  `;

  const storeData = store.readFragment({
    id: data.data.editUserQueue.id,
    fragment,
  });

  storeData.list = data.data.editUserQueue.list;

  console.log('storeData: ', storeData);
  store.writeFragment({
    id: data.data.editUserQueue.id,
    fragment,
    data: {
      ...storeData,
      id: data.data.editUserQueue.id,
      list: storeData.list,
      cursor: data.data.editUserQueue.cursor,
    },
  });
  console.log('store: ', store);
};

export const updateDistance = (store, data) => {
  console.log('data: ', data);
  console.log('store: ', store);

  const fragment = gql`
    fragment User on User {
      distance
    }
  `;
  const storeData = store.readFragment({
    id: data.data.editUser.id,
    fragment,
  });

  console.log('storeData: ', storeData);
  store.writeFragment({
    id: data.data.editUser.id,
    fragment,
    data: {
      ...storeData,
      distance: data.data.editUser.distance,
    },
  });
  console.log('store: ', store);
};
