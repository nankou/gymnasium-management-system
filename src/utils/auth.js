import Cookies from 'js-cookie'


const TokenKey = 'Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

const UserKey = 'UserId'

export function getUserID() {
  return Cookies.get(UserKey)
}

export function setUserID(id) {
  return Cookies.set(UserKey, id)
}

export function removeUserID() {
  return Cookies.remove(UserKey)
}



const RoleKey = "Role"

export function getRoles() {
  return Cookies.get(RoleKey)
}

export function setRoles(roles) {
  return Cookies.set(RoleKey, roles)
}

export function removeRoles() {
  console.log('角色删除成功')
  return Cookies.remove(RoleKey)
}

export function currentRoles(){
  var port = getToken()
  if(port==0){
    return "admin"
  }else if(port==1){
    return "courseLeader"
  }else if(port==2){
    return "outlineCompilers"
  }else if(port==3){
    return "teacher"
  }
}