import {Toast} from 'native-base';

export default ({text,duration = 6000,buttonText = 'Okay',position = 'bottom'},onClose) => {
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