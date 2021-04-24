import axios from "../helpers/axios";

class UserService {
  BASE_API_URL = "users/";
  INVITES_BASE_API_URL = "invites/";

  searchUser = (query) =>
    axios.get(this.BASE_API_URL, {params: {search: query}})
      .then((response) => response.data.results);

  myInvites = () =>
    axios.get(this.INVITES_BASE_API_URL)
      .then((response) => response.data.results);

  sendInvite = (to_user) =>
    axios.post(this.INVITES_BASE_API_URL, {to_user})
      .then((response) => response.data);

  acceptInvite = (id) =>
    axios.post(`${this.INVITES_BASE_API_URL}${id}/accept/`)
      .then((response) => response.data);

  denyInvite = (id) =>
    axios.post(`${this.INVITES_BASE_API_URL}${id}/deny/`)
      .then((response) => response.data);
}


export default new UserService();
