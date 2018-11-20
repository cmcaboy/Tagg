import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { MyAppText } from './common';
import { PRIMARY_COLOR } from '../variables';
import { formatName } from '../format';

const DateOpenButton = ({
  hasDateOpen = false, id, navigation, hostId, name, profilePic,
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
        onPress={() => navigation.navigate('OpenDateList', {
          id: hostId,
          otherId: id,
          otherName: name,
          otherPic: profilePic,
        })
        }
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

const styles = StyleSheet.create({
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
