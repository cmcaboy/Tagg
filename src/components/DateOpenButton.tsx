import React, { SFC } from 'react';
import {
  StyleSheet, View, TouchableOpacity, ViewStyle,
} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { MyAppText } from './common';
import { PRIMARY_COLOR } from '../variables';
import { formatName } from '../format';
import { analytics } from '../firebase';

interface Props {
  hasDateOpen?: boolean;
  id: string;
  navigation: NavigationScreenProp<any, any>;
  hostId: string;
  name: string;
  profilePic: string;
}

interface Style {
  footer: ViewStyle;
  footerContent: ViewStyle;
}

const DateOpenButton: SFC<Props> = ({
  hasDateOpen = false,
  id,
  navigation,
  hostId,
  name,
  profilePic,
}) => {
  if (!hasDateOpen) {
    return null;
  }
  return (
    <View style={styles.footer}>
      <View
        style={{
          borderTopColor: 'gray',
          borderTopWidth: 1,
          opacity: 0.7,
        }}
      />
      <TouchableOpacity
        accessible={false}
        onPress={() => {
          analytics.logEvent('Click_HasDateOpenButton');
          navigation.navigate('OpenDateList', {
            id: hostId,
            otherId: id,
            otherName: name,
            otherPic: profilePic,
          });
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <View style={styles.footerContent}>
            <MyAppText style={{ color: PRIMARY_COLOR, fontWeight: 'bold' }}>
              {`${formatName(name)} is looking for a date!`}
            </MyAppText>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create<Style>({
  footer: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    // paddingVertical: 5,
  },
  footerContent: {
    padding: 7,
  },
});

export default DateOpenButton;
