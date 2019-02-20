import { state } from 'cerebral';

/**
 * sets the state.user to the props.users passed in.
 * This will also store the user into local storage.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store used for setting state.user
 * @param {Object} providers.props the cerebral props object used for getting the props.user
 * @param {Object} providers.applicationContext the application context needed for getting the setCurrentUser method
 */
export default ({ store, props, applicationContext }) => {
  store.set(state.user, props.user);
  applicationContext.setCurrentUser(props.user);

  if (process.env.USTC_ENV === 'dev') {
    window.localStorage.setItem('user', JSON.stringify(props.user));
  }
};
