import store from '../store';

function getAuthorizationHeader() {
  const token = store.auth.data.token;
  return {
    Authorization: `Bearer ${token}`,
  };
}

export default getAuthorizationHeader;
