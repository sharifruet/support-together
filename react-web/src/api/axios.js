import axios from "axios";
import {BASE_URL} from "../conf";
export default axios.create({
  //baseURL: "https://support.i2gether.com/api",
  baseURL: BASE_URL,
  
});

