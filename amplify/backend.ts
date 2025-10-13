import { defineBackend } from '@aws-amplify/backend';
// import { auth } from './auth/resource'; // Temporarily commented out
import { data } from './data/resource';

defineBackend({
  // auth, // Temporarily commented out to reset UserPool
  data,
});
