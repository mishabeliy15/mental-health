import axios from "../helpers/axios";

class StepService {
  BASE_API_URL = "ps_test_step/";

  prepareData = (data) => {
    const formData = new FormData();
    for (const k in data) {
      if (data.hasOwnProperty(k)) {
        if (k === "media_file") {
          formData.append(k, data[k], data[k].name);
        }
        else {
          formData.append(k, data[k]);
        }
      }
    }
    return formData;
  }

  createStep = (data) => {
    const formData = this.prepareData(data);
    return axios.post(this.BASE_API_URL, formData).then((response) => response.data);
  }

  patchStep = (data) => {
    const formData = this.prepareData(data);
    return axios.patch(`${this.BASE_API_URL}${data.id}/`, formData).then((response) => response.data);
  }

  deleteStep = (id) =>
    axios.delete(`${this.BASE_API_URL}${id}/`).then((response) => response.data);
}


export default new StepService();
