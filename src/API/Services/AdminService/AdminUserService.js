import client from "../../client";
import clientAuth from "../../clientAuth";

export default {
  // 
  login: (email, password) => client.post("admin/session/login", {
    json: {
      email: email,
      password: password,
      device_name: "web"
    }
  }),
  //
  logout: () => clientAuth.post("admin/session/logout"),

};