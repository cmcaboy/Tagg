import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import uploadImage from '../firebase/uploadImage';
import { Spinner } from './common';
import { NUM_PHOTOS, PHOTO_ADD_URL } from '../variables';

const fillBlanks = (u: string[]) => {
  const ul = [];
  for (let i = 0; i < NUM_PHOTOS; i += 1) {
    if (u[i]) {
      ul.push(u[i]);
    } else {
      ul.push(PHOTO_ADD_URL);
    }
  }
  return ul;
};

interface Props {
  urlList: string[];
  startChangePics: (pics: string[]) => any;
}

interface State {
  isLoading: boolean[];
  isSelected: boolean[];
  urlList: string[];
}

class PhotoSelector extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const urlList = fillBlanks(this.props.urlList);

    this.state = {
      urlList,
      isLoading: urlList.map(item => false),
      isSelected: urlList.map(item => false),
    };
  }

  componentWillReceiveProps(nextProps: any) {
    // console.log('willReceiveProps: ',nextProps);
    const urlList = fillBlanks(nextProps.urlList);
    if (urlList) {
      this.setState({ urlList });
      this.setState({ isSelected: urlList.map(item => false) });
    }
  }

  switchPicPosition = (a: number, b: number) => {
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
    console.log('change pics temp: ', temp);
    startChangePics(temp);
  }

  pickImage = (i: number) => {
    console.log('pickImage i: ', i);
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

      console.log('in imagepicker');
      console.log('response: ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.resetLoading();
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.resetLoading();
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // const source = { uri: response.uri.uri };
        const source = response.uri;
        console.log('source: ', source);

        // console.log('source: ', source);

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        console.log('before uploadImage');
        const url = await uploadImage(source);
        console.log('after uploadImage');

        const newUrlList = urlList.map((item, index) => {
          return index === i ? url : item;
        });
        console.log('newUrlList: ', newUrlList);
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

  resetLoading = () => {
    const { urlList } = this.state;
    this.setState({ isLoading: urlList.map(item => false) });
  }

  async selectImage(index: number) {
    await this.setState(prevState => ({ 
      isSelected: prevState.isSelected.map((k, i) => (i === index ? !k : k)),
    }));
    // console.log('select: ',this.state.isSelected);
    // console.log('num selected: ', this.state.isSelected.filter(item => item === true))
    if (this.state.isSelected.filter(item => item === true).length > 1) {
      // console.log('both selected');
      const a: any[] = [];
      this.state.isSelected.forEach((item, ind) => {
        if (item === true) {
          a.push(ind);
          this.setState((prev) => ({ isLoading: prev.isLoading.map((s, i) => i === ind ? true : s) }));
        };
      });
      await this.switchPicPosition(a[0], a[1]);
      this.resetSelected();
      this.resetLoading();
    }
  }

  // I had to do this for Android. The images would not re-render properly
  // without it.


  render() {
    console.log('urlList: ',this.props.urlList);
    // console.log('isSelected: ',this.state.isSelected);
    // console.log('isLoading: ',this.state.isLoading);
    const { urlList, isLoading, isSelected } = this.state;
    // console.log('urlList: ', urlList);
    return (
      <View style={styles.container}>
        {urlList.map((item, index) => {
          // console.log('item: ', item);
          return isLoading[index] ? (
            <Spinner key={index} size="small" style={styles.photo as ViewStyle} />
          ) : (
            <TouchableOpacity
              key={index}
              onPress={item !== PHOTO_ADD_URL ? (
                () => this.selectImage(index)
              ) : (
                () => this.pickImage(index)
              )}
              onLongPress={() => this.pickImage(index)}
            >
              {console.log('item: ', item)}
              <Image
                style={[styles.photo, isSelected[index] ? styles.highlighted : styles.notHighlighted]}
                source={{ uri: item || PHOTO_ADD_URL }}
              />
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }
}

interface Style {
  container: ViewStyle;
  photo: ImageStyle;
  highlighted: ImageStyle;
  notHighlighted: ImageStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
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
