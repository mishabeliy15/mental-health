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
}


export default new TestHistoryService();
