import axios from "../helpers/axios";

class TestService {
  BASE_API_URL = "ps_test/";
  MY_TEST_API_URL = `${this.BASE_API_URL}my/`;
  CATEGORIES_API_URL = "categories/";

  createTest(data) {
    return axios.post(this.BASE_API_URL, data).then((response) => response.data);
  }

  getCategories() {
    return axios.get(this.CATEGORIES_API_URL).then((response) => response.data.results);
  }

  myTest() {
    return axios.get(this.MY_TEST_API_URL).then((response) => response.data.results);
  }


  getTestDetail(id) {
    return axios.get(`${this.BASE_API_URL}${id}/`).then((response) => response.data);
  }

  patchTest(data) {
    return axios.patch(`${this.BASE_API_URL}${data.id}/`, data).then((response) => response.data);
  }

  putTest(data) {
    return axios.put(`${this.BASE_API_URL}${data.id}/`, data).then((response) => response.data);
  }
}


export default new TestService();
