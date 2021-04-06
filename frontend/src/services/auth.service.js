import axios from "../helpers/axios";

class AuthService {
  REGISTER_API_URL = "/auth/users/";
  LOGIN_API_URL = "/auth/jwt/create/";
  MY_API_URL = "/auth/users/me/";

  login(username, password) {
    return axios
      .post(this.LOGIN_API_URL, { username, password })
      .then((response) => {
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
        return this.my().then((user) => {
          localStorage.setItem("user", JSON.stringify(user));
          return user;
        });
      });
  }

  my() {
    return axios.get(this.MY_API_URL).then((response) => response.data);
  }

  register(userData) {
    const formData = new FormData();
    userData.date_of_birthday = userData.date_of_birthday.toISOString();
    const tPos = userData.date_of_birthday.indexOf("T");
    if (tPos !== -1) {
      userData.date_of_birthday = userData.date_of_birthday.substr(0, tPos);
    }
    for (let key in userData) {
      if (userData.hasOwnProperty(key)) {
        if (key === "avatar") formData.append(key, userData[key], "avatar.png");
        else formData.append(key, userData[key]);
      }
    }
    return axios.post(this.REGISTER_API_URL, formData).then((response) => {
      return response.data;
    });
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  }
}

export default new AuthService();
