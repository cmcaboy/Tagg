import React, { SFC } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Props {
  onPress: () => void; // required
  style?: ViewStyle;
  name?: string;
  color?: string;
  size?: number;
}

interface Style {
  iconStyle: ViewStyle;
}

const ActionIcon: SFC<Props> = ({
  onPress, style, name = 'done', color = 'green', size = 14,
}) => {
  const { iconStyle } = styles;
  return (
    <TouchableOpacity onPress={onPress} style={[iconStyle, style]}>
      <MaterialIcons name={name} color={color} size={size} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create<Style>({
  iconStyle: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingRight: 10,
    paddingLeft: 20,
  },
});

export { ActionIcon };
