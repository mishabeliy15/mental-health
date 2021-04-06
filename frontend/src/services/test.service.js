import axios from "../helpers/axios";

class TestService {
  BASE_API_URL = "ps_test/";
  CATEGORIES_API_URL = "categories/";

  createTest(data) {
    return axios.post(this.BASE_API_URL, data).then((response) => response.data);
  }

  getCategories() {
    return axios.get(this.CATEGORIES_API_URL).then((response) => response.data.results);
  }

}


export default new TestService();
