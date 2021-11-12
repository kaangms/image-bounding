import axios from "axios";

export default class TicketService {
  getTickets() {
    let endpoint = `${BASE_URL}/tickets/getall`;

    return axios.get(endpoint);
  }
  addBoxTickets(boxTicketAddDto) {
    let endpoint = `${BASE_URL}/boxtickets/add`;
    console.log(JSON.stringify(boxTicketAddDto));
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
    };
    return axios
      .post(endpoint, JSON.stringify(boxTicketAddDto), { headers })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  readAnnotationTxt() {
    let endpoint = `http://localhost:3000/annotation.txt`;
    return axios.get(endpoint);
  }
  writeAnnotationTxt(data) {
    let endpoint = `http://localhost:3000/annotation.txt`;
    return axios
      .post(endpoint, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
export const BASE_URL = "https://localhost:44307/api";
