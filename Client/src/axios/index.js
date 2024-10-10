import axios from 'axios'
import Cookies from 'universal-cookie'

const baseURL = process.env.REACT_APP_BASE_URL
axios.defaults.withCredentials = true
const Cookie = new Cookies()

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
    Cookie: `token:${Cookie.get('token')}`,
    Authorization: ` Bearer ${Cookie.get('token')}`,
  },
  withCredentials: true,
})
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    //Handle refresh token here
    const originalRequest = error.config
    if (error?.response?.status === 401) {
      // clearLocalStorage();
      //   window.location.href = "/login";
      return Promise.reject(error)
    }
    if (error.response.status === 306 && !originalRequest._retry) {
      originalRequest._retry = true
      //do some stuff here........
      return axiosInstance(originalRequest)
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
