const axios = require('axios');
const baseUrl = "https://loripsum.net/api";

exports.getRandomText = () => {
  // https://loripsum.net/api/plaintext

  return new Promise((resolve, reject) => {

    axios.get(baseUrl + '/plaintext', {responseType: "text"})
    .then((response) =>{
      resolve(response.data);
    })
    .catch((error) =>{
      console.log(error);
      reject(false);
    })

  })

}
