import { Toast } from 'native-base';
import { analytics } from '../firebase';

interface Params {
  text: string;
  duration?: number;
  buttonText?: string;
  position?: 'bottom' | 'top' | 'center';
  // position?: string;
  type?: 'success' | 'warning' | 'danger';
}

// First parameter: object containing details about the test message including
// text, button text, position, and duration
// The second parameter is a callback that is executed when the toast button is pressed

const ToastMessage = (
  {
    text, duration = 6000, buttonText = 'Okay', position = 'bottom', type = 'success',
  }: Params,
  onClose = () => {},
) => {
  analytics.logEvent('Event_toast_message');
  return Toast.show({
    text,
    buttonText,
    duration,
    position,
    onClose: (reason) => {
      console.log('toast close reason: ', reason);
      // reason can be user or timeout
      if (reason === 'user') {
        analytics.logEvent('Click_toast_message_close');
        onClose();
      }
    },
  });
};

export default ToastMessage;
