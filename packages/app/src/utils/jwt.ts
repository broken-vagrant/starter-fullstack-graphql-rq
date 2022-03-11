export function getJwtToken() {
  return sessionStorage.getItem("jwt");
}
export function setJwtToken(token: string) {
  sessionStorage.setItem("jwt", token)
}

// Longer duration refresh token (30-60 min)
export function getRefreshToken() {
  return sessionStorage.getItem("refreshToken")
}

export function setRefreshToken(token: string) {
  sessionStorage.setItem("refreshToken", token)
}

export function removeJwtTokens() {
  localStorage.removeItem('jwt');
  localStorage.removeItem('refreshToken');
}