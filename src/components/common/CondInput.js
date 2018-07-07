import React, { Component } from 'react';
import {  
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput
} from 'react-native';
import {CardSection,Button,ActionIcon} from './index';

class CondInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit:false,
      value: this.props.value
    }
  }

  confirmUpdate = () => {
    this.props.updateValue(this.state.value)
    this.setState({isEdit:false})
  }

  render() {
    const {isEdit,value}   = this.state;
    const {field,updateValue, multiline = false} = this.props;
    return (
      <View style={styles.container}>
        {!isEdit? (
          <TouchableOpacity onPress={() => this.setState({isEdit:true})}>
            <CardSection style={styles.cardSection}>
              <Text style={value? styles.field : styles.blankField}>{value? value : field}</Text>
            </CardSection>
          </TouchableOpacity>
          ) : (
          <CardSection style={styles.cardSection}>
            <View style={styles.editView}>
              <TextInput
                selectTextOnFocus
                autoFocus={true}
                style={styles.textInputStyle}
                onChangeText={(value) => this.setState({value})}
                value={`${value}`}
                multiline={multiline}
                onEndEditing={() => this.confirmUpdate()}
              />
              <ActionIcon 
                onPress={() => this.confirmUpdate()}
                name="done"
                size={32}
                color="green"
                style={styles.checkMarker}
              />
              {/*
                <Button 
                onPress={() => this.confirmUpdate()}
                >Save</Button>
              */}
              
            </View>
          </CardSection>
      )}
      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  blankField: {
    opacity: 0.6
  },
  field: {
    opacity:1.0
  },
  editView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  textInputStyle: {
    height: 40,
    flex: 6,
    borderColor: 'gray',
    borderWidth: 0
  },
  checkMarker: {
    flex: 1
  },
  cardSection: {
    minHeight: 40,
    alignItems: 'center',
  }
})

export {CondInput};