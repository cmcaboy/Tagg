// returns true if email is valid
// false if email is not valid

import { EMAIL_REGEX } from '../variables';

export default email => EMAIL_REGEX.test(email);
