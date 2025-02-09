import axios from 'axios'

const axiosClient = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || 'http://localhost:3000', // Base URL cho API
  timeout: 10000, // Thời gian timeout (ms)
  headers: {
    'Content-Type': 'application/json' // Định dạng gửi request
  }
})

// Thêm interceptor cho request
axiosClient.interceptors.request.use(
  (config) => {
    // Thêm token vào header nếu có
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Thêm interceptor cho response
axiosClient.interceptors.response.use(
  (response) => {
    // Xử lý response data
    return response.data
  },
  (error) => {
    // Xử lý lỗi chung
    if (error.response) {
      const { status } = error.response
      if (status === 401) {
        // Xử lý khi token hết hạn
        console.error('Unauthorized! Redirecting to login...')
        window.location.href = '/login'
      } else if (status === 403) {
        console.error("Forbidden! You don't have permission.")
      } else if (status === 500) {
        console.error('Internal Server Error')
      }
    } else {
      console.error('Network Error or Server is unreachable')
    }
    return Promise.reject(error)
  }
)

export default axiosClient
