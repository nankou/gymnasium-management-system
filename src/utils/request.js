import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth';
import { removeToken, setToken } from './auth';

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000 // request timeout
})

// request interceptor
// service.interceptors.request.use(
//   config => {
//     // do something before request is sent

//     if (store.getters.token) {
//       // let each request carry token
//       // ['X-Token'] is a custom headers key
//       // please modify it according to the actual situation
//       config.headers['X-Token'] = getToken()
//     }
//     return config
//   },
//   error => {
//     // do something with request error
//     console.log(error) // for debug
//     return Promise.reject(error)
//   }
// )

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    const hasToken = getToken();
  
    console.log("===hastoken")
    console.log(hasToken);
    console.log( hasToken !== "undefined")
    if (hasToken && (typeof hasToken !== "undefined") && hasToken !== "undefined") {
      console.log("===hastoken ===")
      // let each request carry token
      // ['token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken()
    }else{
      config.headers['token'] =" "
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // console.log(response);
    // // console.log(decodeURI(response.headers["content-type"]))
    // //获取content-type的值，但是为什么 加decodeURI不清楚
    // console.log(decodeURI(response.headers["content-type"])==="application/octet-stream");
    // if(decodeURI(response.headers["content-type"])==="application/octet-stream"){
    //   return response;
    // }
    console.log("拦截器res");
    console.log(response);
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      //无权限
      if(res.code == 427)
      {
        Message({
          message: res.msg || 'Error',
          type: 'warning',
          duration: 5 * 1000
        })
      }else{
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 401 || res.code === 512 || res.code === 514) {
        // to re-login
        MessageBox.confirm('你已经退出了，你可以取消待在这个页面，或者重新登录', '确定注销', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeToken();
          this.$router.push('/login')
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } 
    else {
      //返回的值，不再是response.data,而是直接值response，--文波
      return res;
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
