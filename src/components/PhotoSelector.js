import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import uploadImage from '../firebase/uploadImage';
import { Spinner } from './common';
import { PLACEHOLDER_PHOTO } from '../variables';

class PhotoSelector extends React.Component {
  constructor(props) {
    super(props);
    const { urlList } = this.props;
    this.state = {
      isLoading: urlList.map(item => false),
      isSelected: urlList.map(item => false),
      urlList,
    };
  }

  componentWillReceiveProps(nextProps) {
    // console.log('willReceiveProps: ',nextProps);
    if (nextProps.urlList) {
      this.setState({ urlList: nextProps.urlList });
      this.setState({ isSelected: nextProps.urlList.map(item => false) });
    }
  }

  switchPicPosition = (a, b) => {
    const { urlList } = this.state;
    const { startChangePics } = this.props;
    const temp = urlList.map((item, i) => {
      if (i === a) {
        return urlList[b];
      }
      if (i === b) {
        return urlList[a];
      }
      return item;
    });

    startChangePics(temp);
  }

  pickImage = (i) => {
    this.setState(prevState => ({
      isLoading: prevState.isLoading.map((item, index) => (
        index === i ? true : item
    )),
  }));

    const options = {
      title: 'Select Avatar',
      customButtons: [
        { name: 'fb', title: 'Choose Photo from Facebook' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, async (response) => {
      const { startChangePics } = this.props;
      const { urlList } = this.state;
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri.uri };

        console.log('source: ', source);

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        const url = await uploadImage(source);

        const newUrlList = urlList.map((item, index) => {
          // console.log('item: ',item);
          // console.log('index: ',index);
          return index === i ? url : item;
        });
        startChangePics(newUrlList);

      this.setState(prevState => ({
        isLoading: prevState.isLoading.map((item, index) => (
          index === i ? false : item
        )),
      }));
      }
    });
  }

  resetSelected = () => {
    const { urlList } = this.state;
    this.setState({ isSelected: urlList.map(item => false) });
  }

  async selectImage(index) {
    const { isSelected } = this.state;
    await this.setState(prevState => ({ 
      isSelected: prevState.isSelected.map((k, i) => (i === index ? !k : k)),
    }));
    // console.log('select: ',this.state.isSelected);
    if (isSelected.filter(item => item === true).length === 2) {
      const a = [];
      isSelected.forEach((item, ind) => {
        if (item === true) {
          a.push(ind);
        }
      });
      await this.switchPicPosition(a[0], a[1]);
      this.resetSelected();
    }
  }

  // I had to do this for Android. The images would not re-render properly
  // without it.


  render() {
    // console.log('urlList: ',this.props.urlList);
    // console.log('isSelected: ',this.state.isSelected);
    // console.log('isLoading: ',this.state.isLoading);
    const { urlList, isLoading, isSelected } = this.state;
    return (
      <View style={styles.container}>
        {urlList.map((item, index) => {
          // console.log('item: ',item);
          return isLoading[index] ? (
            <Spinner key={item} size="small" style={styles.photo} />
          ) : (
            <TouchableOpacity
              key={item}
              onPress={item !== PLACEHOLDER_PHOTO ? (
                () => this.selectImage(index)
              ) : (
                () => this.pickImage(index)
              )}
              onLongPress={() => this.pickImage(index)}
            >
              <Image
                style={[styles.photo, isSelected[index] ? styles.highlighted : styles.notHightlighted]}
                source={{ uri: item || PLACEHOLDER_PHOTO }}
              />
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    // height: 150
  },
  photo: {
    borderRadius: ((Dimensions.get('window').width / 3) - 5) * 0.1,
    margin: 2,
    width: (Dimensions.get('window').width / 3) - 13,
    height: (Dimensions.get('window').width / 3) - 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlighted: {
    borderWidth: 3,
    borderColor: '#FFDF00',
  },
  notHighlighted: {
    borderWidth: 0,
  },
});

export default PhotoSelector;
