import decode from "jwt-decode"

class AuthService {
    //Get from local storage depend on what Hunter rename the getItem
    getuserToken(){
        return localStorage.getItem("id_token")
    }
    getuserProfile (){
        return decode(this.getuserToken())
    }
}
export default new AuthService()