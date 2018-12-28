import React from 'react';
import {
  View, StyleSheet, ScrollView, RefreshControl, ViewStyle,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MyAppText } from './common';
import { analytics } from '../firebase';

interface Props {
  refetch?: () => any;
  text?: string;
  subText?: string;
}
interface State {
  loading: boolean;
}
class EmptyList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount = () => {
    analytics.logEvent('Event_EmptyList');
  };

  render() {
    const { refetch = () => {}, text = '', subText = '' } = this.props;
    const { loading } = this.state;
    return (
      <ScrollView
        contentContainerStyle={styles.noBidders}
        refreshControl={(
          <RefreshControl
            refreshing={loading}
            onRefresh={async () => {
              this.setState({ loading: true });
              await refetch();
              this.setState({ loading: false });
              analytics.logEvent('Click_EmptyList_Refresh');
            }}
          />
)}
      >
        <View style={styles.noBidders}>
          <Ionicons name="md-sad" size={100} color="black" />
          <MyAppText>{text}</MyAppText>
          <MyAppText>{subText}</MyAppText>
        </View>
      </ScrollView>
    );
  }
}

interface Style {
  noBidders: ViewStyle;
}

// We put the styles in the component
const styles = StyleSheet.create<Style>({
  noBidders: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EmptyList;
