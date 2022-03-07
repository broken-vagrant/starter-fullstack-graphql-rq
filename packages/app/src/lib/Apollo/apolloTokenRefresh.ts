import { TokenRefreshLink } from "apollo-link-token-refresh"
import { JwtPayload } from "jwt-decode"
import { getJwtToken, getRefreshToken, setJwtToken } from "./auth";
import decodeJWT from "jwt-decode";

export function makeTokenRefreshLink() {
  return new TokenRefreshLink({
    // Indicates the current state of access token expiration
    // If token not yet expired or user doesn't have a token (guest) true should be returned
    isTokenValidOrUndefined: () => {
      console.log("isTokenValidOrUndefined")
      const token = getJwtToken()

      // If there is no token, the user is not logged in
      // We return true here, because there is no need to refresh the token
      if (!token) return true

      // Otherwise, we check if the token is expired
      const claims: JwtPayload = decodeJWT(token)
      const expirationTimeInSeconds = claims.exp ? claims.exp * 1000 : Number.NEGATIVE_INFINITY;
      const now = new Date()
      const isValid = expirationTimeInSeconds >= now.getTime()

      // Return true if the token is still valid, otherwise false and trigger a token refresh
      return isValid
    },
    fetchAccessToken: async () => {
      const jwt: any = decodeJWT(getJwtToken() || '')
      console.log("fetchAccessToken jwt:", jwt)

      const refreshToken = getRefreshToken()
      const fingerPrintHash = jwt?.["https://hasura.io/jwt/claims"]?.["X-User-Fingerprint"]

      const request = await fetch(import.meta.env["VITE_BACKEND_URL"], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
                  query RefreshJwtToken($data: RefreshTokenInput!) {
                    refreshToken(data: $data) {
                      jwt
                    }
                  }
                `,
          variables: {
            data: {
              refreshToken,
              fingerPrintHash
            }
          },
        }),
      })

      const result = await request.json()
      return result
    },
    handleFetch: (accessToken) => {
      const claims = decodeJWT(accessToken)
      console.log("handleFetch", { accessToken, claims })
      setJwtToken(accessToken)
    },
    handleResponse: (operation, accessTokenField) => (response: any) => {
      // here you can parse response, handle errors, prepare returned token to
      // further operations
      // returned object should be like this:
      // {
      //    access_token: 'token string here'
      // }
      console.log("handleResponse", { operation, accessTokenField, response })
      return { access_token: response.refreshToken.jwt }
    },
    handleError: (err) => {
      console.warn("Your refresh token is invalid. Try to reauthenticate.")
      console.error(err)
      // Remove invalid tokens
      localStorage.removeItem("jwt")
      localStorage.removeItem("refreshToken")
    },
  })
}