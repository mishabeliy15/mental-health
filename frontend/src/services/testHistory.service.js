import axios from "../helpers/axios";

class TestHistoryService {
  BASE_API_URL = "ps_test_history/";
  STEP_BASE_API_URL = "ps_test_step_history/";

  createTestHistory = (testId) =>
    axios.post(this.BASE_API_URL, {test: testId}).then((response) => response.data);

  completeTestHistory = (id) =>
    axios.patch(`${this.BASE_API_URL}${id}/`, {status: 2}).then((response) => response.data);

  addStepHistory = (test_history, step) =>
    axios.post(this.STEP_BASE_API_URL, {test_history, step}).then((response) => response.data);

  getMyTestHistory = () =>
    axios.get(this.BASE_API_URL).then((response) => response.data.results);

  getUserTestHistory = (ownerId) =>
    axios.get(this.BASE_API_URL, {params: {owner: ownerId}})
      .then((response) => response.data.results);

  getDetailHistory = (id) =>
    axios.get(`${this.BASE_API_URL}${id}/`).then((response) => response.data);

}


export default new TestHistoryService();
