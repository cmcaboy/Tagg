import {Toast} from 'native-base';

export default ({text,duration = 6000,buttonText = 'Okay',position = 'bottom'},onClose) => {
    // First parameter: object containing details about the test message including 
    // text, button text, position, and duration
    // The second parameter is a callback that is executed when the toast button is pressed
    return Toast.show({
        text,
        buttonText,
        duration,
        position,
        onClose: (reason) => {
            console.log('toast close reason: ',reason);
            // reason can be user or timeout
            if(reason === 'user') {
                onClose()
            }
        }
    });
}