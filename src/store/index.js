import { action, observable, makeObservable, runInAction } from 'mobx';
import EncryptedStorage from 'react-native-encrypted-storage';

class authStore {
  @observable auth = {
    notifyId: '',
    isAuth: false,
    state: 1,
    data: {
      firstname: '',
      lastname: '',
      email: '',
      token: '',
      userId: '',
    },
  };

  @observable version = '1.0.0';
 
  constructor() {
    makeObservable(this);
    this.loadAuthData();
  }

  async saveSecureData(key, value) {
    try {
      await EncryptedStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      return false;
    }
  }


  async getSecureData(key) {
    try {
      const value = await EncryptedStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return null;
    }
  }


  @action async loadAuthData() {
    try {
      const data = await this.getSecureData('authData');
      if (data) {
        runInAction(() => {
          this.auth.isAuth = true;
          this.auth.data = data;
        });
      }
    } catch (error) {
      console.error('Error loading authData:', error);
    }
  }

  @action setAccessToken(newToken, callback) {
    this.auth.data.token = newToken;
    this.saveSecureData('authData', this.auth.data).then(() => {
      callback();
    });
  }

  @action async signIn(data, callback) {
    await this.saveSecureData('authData', data);
    runInAction(() => {
      this.auth.isAuth = true;
      this.auth.data = data;
      if (typeof callback === 'function') {
        callback();
      }
    });
  }
  

  @action async userDeleteOrOut() {
    await EncryptedStorage.removeItem('authData');
    runInAction(() => {
      this.auth.isAuth = false;
      this.auth.data = {
        firstname: '',
        lastname: '',
        email: '',
        token: '',
      };
    });
  }

  @action setAuthCode(val) {
    this.authCode = val;
  }

  @action setGoogleId(val) {
    this.googleId = val;
  }

  @action activePremium(packetId, callback) {
    this.auth.data.packetId = packetId;
    this.saveSecureData('authData', this.auth.data).then(() => {
      callback();
    });
  }

  @action async signOut() {
    await EncryptedStorage.removeItem('authData');
    runInAction(() => {
      this.auth.isAuth = false;
      this.auth.data = {
        firstname: '',
        lastname: '',
        email: '',
        token: '',
        userId: '',
      };
    });
  }

  @action setProfile(val, callback) {
    this.auth.data.firstname = val.firstname;
    this.auth.data.lastname = val.lastname;
    this.saveSecureData('authData', this.auth.data).then(() => {
      callback();
    });
  }
}

export default new authStore();