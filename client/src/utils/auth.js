import decode from "jwt-decode"

class AuthService {
    //Get from local storage depend on what name is assigned in the setItem
    getuserToken() {
        return localStorage.getItem("user_token")
    }
    getuserProfile() {
        return decode(this.getuserToken())
    }
    //Need methods for login, logout, logged in, expired token 
    login(userToken) {
        localStorage.setItem("user_token", userToken)
        window.location.assign("/") //If user log in successful, direct to homepage
    }
    logout() {
        localStorage.removeItem("user_token")
        window.location.assign("/") // If user logs out, reomve their token.
    }
    loggedIn() {
        const currentuserToken = this.getuserToken()
        return currentuserToken && !this.isTokenExpired(currentuserToken) ? true : false;
    }

    isTokenExpired(token) {
        // Decode the token to get its expiration time that was set by the server
        const decoded = decode(token);
        // If the expiration time is less than the current time (in seconds), the token is expired and we return `true`
        if (decoded.exp < Date.now() / 1000) {
            localStorage.removeItem('user_token');
            return true;
        }
        // If token hasn't passed its expiration time, return `false`
        return false;
    }
}
export default new AuthService()