import decode from "jwt-decode"

class AuthService {
    //Get from local storage depend on what name is assigned in the setItem
    getuserToken(){
        return localStorage.getItem("user_token")
    }
    getuserProfile (){
        return decode(this.getuserToken())
    }
 //Need methods for login, logout, logged in, expired token 
 login(userToken){
     localStorage.setItem("user_token", userToken)
     window.location.assign("/") //If user log in successful, direct to homepage
 }  
}
export default new AuthService()