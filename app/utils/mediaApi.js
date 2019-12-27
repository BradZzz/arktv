import axios from 'axios';

export default axios.create({
  baseURL: `https://us-central1-modified-enigma-669.cloudfunctions.net/`,
  responseType: 'json'
});
