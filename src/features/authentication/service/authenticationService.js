import { api } from "../../../shared/services/api";

export const TOKEN_SESSION_ATTRIBUTE_NAME = 'token'
export const EXPIRATION_SESSION_ATTRIBUTE_NAME = 'expiration'

export const registerSuccessfulLoginForJwt = (token, expiration) => {

  localStorage.setItem(TOKEN_SESSION_ATTRIBUTE_NAME, token)
  localStorage.setItem(EXPIRATION_SESSION_ATTRIBUTE_NAME, expiration)

  setupAxiosInterceptors()
}

export const setupAxiosInterceptors = () => {

  let token = createJWTToken(localStorage.getItem(TOKEN_SESSION_ATTRIBUTE_NAME))

  if (isUserLoggedIn()) {
    api.defaults.headers.common['Authorization'] = token;

  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export const createJWTToken = (token) => {
  return 'Bearer ' + token
}

export const logout = () => {

  localStorage.clear()
  delete axios.defaults.headers.common['Authorization'];
}

export const isTokenExpired = () => {

  let expirationToken = new Date(localStorage.getItem(EXPIRATION_SESSION_ATTRIBUTE_NAME))
  return new Date() > expirationToken
}

export const isUserLoggedIn = () => {

  let token = localStorage.getItem(TOKEN_SESSION_ATTRIBUTE_NAME);

  if (!token) {
    return false;
  }

  return !isTokenExpired();
}

export const getToken = () => {

  let token = localStorage.getItem(TOKEN_SESSION_ATTRIBUTE_NAME)
  if (token === null) return ''
  return token
}