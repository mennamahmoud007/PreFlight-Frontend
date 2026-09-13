import axios from 'axios';

//if device id is not present in local storage, generate a new one and store it
function getDeviceId() {
    let deviceId = localStorage.getItem('device_id');

    if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem('device_id', deviceId);
    }

    return deviceId;
}
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        Accept: 'application/json',
    },
});

// Add the device ID to each request
api.interceptors.request.use((config) => {
    config.headers['X-Device-ID'] = getDeviceId();
    return config;
});

export default api;