//store.js
import { createStore } from 'vuex';
import axios from 'axios';
import { saveToDB, getFromDB, clearStore } from '@/utils/indexedDB'; // IndexedDB Utility

const store = createStore({
  state() {
    return {
      authToken: '',
      user: {
        name: '',
        role: '',
        email: '',
      },
      isLoggedIn: false,
    };
  },
  mutations: {
    setAuthToken(state, token) {
      state.authToken = token;
      state.isLoggedIn = !!token;
    },
    setUser(state, user) {
      state.user = { ...user };
    },
    logout(state) {
      state.authToken = '';
      state.user = { name: '', role: '', email: '' };
      state.isLoggedIn = false;
    },
  },
  actions: {
    async login({ commit }, { email, password, role, remember_me }) {
      
        const response = await axios.post('/login', { email, password, role, remember_me });
        const token = response.data.token;
        const user = response.data.user;

        // Fetch full user data
        const userResponse = await axios.get('/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userWithRelations = userResponse.data.user;

        if (!userWithRelations.id_user) {
            throw new Error('User object is missing "id_user" property');
        }

        const currentTime = new Date().getTime();
        const expirationTime = remember_me
          ? currentTime + 2 * 24 * 60 * 60 * 1000 // 2 days
          : currentTime + 24 * 60 * 60 * 1000; // 1 day

        // Save to IndexedDB
        await saveToDB('settings', { key: 'token', value: token });
        await saveToDB('settings', { key: 'userExpiration', value: expirationTime });
        await saveToDB('users', { key: 'id_user', ...userWithRelations });

        // Save to Vuex
        commit('setAuthToken', token);
        commit('setUser', userWithRelations);

        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },
    async fetchUser({ commit, dispatch }) {
      try {
        const tokenData = await getFromDB('settings', 'token');
        const userExpirationData = await getFromDB('settings', 'userExpiration');

        if (tokenData && userExpirationData) {
          const token = tokenData.value;
          const userExpiration = userExpirationData.value;
          const currentTime = new Date().getTime();

          if (currentTime < userExpiration) {
            const userData = await getFromDB('users', 'id_user'); // Gunakan ID pengguna yang sesuai
            if (userData) {
              commit('setAuthToken', token);
              commit('setUser', userData);
              axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } else {
              console.warn('No user data found, logging out.');
              dispatch('logout');
            }
          } else {
            console.warn('Token expired, logging out.');
            dispatch('logout');
          }
        }
      } catch (error) {
        console.error('Error fetching user data from IndexedDB:', error);
      }
    },
    async refreshUserData({ commit }) {
      try {
        const tokenData = await getFromDB('settings', 'token');
        if (!tokenData) return;

        const token = tokenData.value;
        const userResponse = await axios.get('/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const updatedUser = userResponse.data.user;

        // Save to IndexedDB
        await saveToDB('users', { key: 'id_user', ...updatedUser });

        // Update Vuex
        commit('setUser', updatedUser);
      } catch (error) {
        console.error('Error refreshing user data:', error);
        await clearStore('settings');
        await clearStore('users');
        commit('logout');
      }
    },
    async logout({ commit }) {
      try {
        const tokenData = await getFromDB('settings', 'token');
        const token = tokenData ? tokenData.value : null;

        if (token) {
          await axios.post('/logout', {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        // Clear IndexedDB
        await clearStore('settings');
        await clearStore('users');

        // Clear Vuex
        commit('logout');
        delete axios.defaults.headers.common['Authorization'];
      } catch (error) {
        console.error('Error during logout:', error);
        await clearStore('settings');
        await clearStore('users');
        commit('logout');
        delete axios.defaults.headers.common['Authorization'];
      }
    },
    async fetchUserData({ commit }) {
      try {
        const userData = await getFromDB('users', 'id_user');
        if (userData) {
          commit('setUser', userData);
        } else {
          console.warn('No user data found in IndexedDB.');
        }
      } catch (error) {
        console.error('Error fetching user data from IndexedDB:', error);
      }
    }
    
  },
  getters: {
    isLoggedIn(state) {
      return state.isLoggedIn;
    },
    getUser(state) {
      return state.user;
    },
  },
});

export default store;
