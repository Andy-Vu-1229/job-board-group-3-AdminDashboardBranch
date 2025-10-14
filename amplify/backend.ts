import { defineBackend } from '@aws-amplify/backend';
// import { auth } from './auth/resource'; // Removed Cognito auth
import { data } from './data/resource';

defineBackend({
  // auth, // Removed Cognito auth
  data,
});
