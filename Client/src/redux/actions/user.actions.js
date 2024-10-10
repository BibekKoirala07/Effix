import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../axios'
import Cookies from 'universal-cookie'
const Cookie = new Cookies()
axiosInstance.defaults.withCredentials = true
export const getUserDetails = createAsyncThunk(
  'user/getUserDetails',
  async () => {
    try {
      const response = await axiosInstance.post(
        `user/requireSignIn`,
        {},
        {
          withCredentials: true,

          headers: {
            Cookie: `token:${Cookie.get('token')}`,
            Authorization: ` Bearer ${Cookie.get('token')}`,
          },
        },
      )
      if (response.status === 200) {
        return [response, null]
      } else {
        throw response
      }
    } catch (error) {
      return [null, error]
    }
  },
)
