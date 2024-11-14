import client from "../../client";
import clientAuth from "../../clientAuth";

export default {
  // 
  login: (email, password, rememberMe) => client.post("admin/session/login", {
    json: {
      email: email,
      password: password,
      device_name: "web",
      remember_me: rememberMe
    }
  }),
  //
  logout: () => clientAuth.post("admin/session/logout"),
  change_password: (userData) => clientAuth.post(`admin/session/change-password`, { json: userData }),

};