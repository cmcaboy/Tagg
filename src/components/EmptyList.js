import React from 'react';
import {View,StyleSheet,ScrollView,RefreshControl} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MyAppText} from './common';

class EmptyList extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }

    render() {
        const { refetch = () => {}, text = '', subText = ''} = this.props;
        return (
            <ScrollView
                contentContainerStyle={styles.noBidders}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.loading}
                        onRefresh={async () => {
                            this.setState({loading:true});
                            await refetch();
                            this.setState({loading:false});
                        }}
                    />
                }
            >
            <View style={styles.noBidders}>
                <Ionicons 
                    name="md-sad"
                    size={100}
                    color="black"
                />
                <MyAppText>{this.props.text}</MyAppText>
                <MyAppText>{this.props.subText}</MyAppText>
            </View>
        </ScrollView>
        )
    }
}

// We put the styles in the component
const styles = StyleSheet.create({
    noBidders: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default EmptyList;