import ky from 'ky';

let userData = localStorage.getItem('admintoken') ? localStorage.getItem('admintoken') : "";
class HTTPError extends Error { }
const AdminAuth = ky.extend({
  //  prefixUrl: "http://localhost/hbr/public/api/",
  prefixUrl: "https://vegasdata.homes/portal/public/api/",
  
  hooks: {
    beforeRequest: [
      (options) => {
        const localHeaders = JSON.parse(localStorage.getItem('admintoken'));

        if (localHeaders) {
          options.headers.set('Authorization', `Bearer ${localHeaders}`);
        }
      },
    ],
    afterResponse: [
      async (response) => {
        if (response.status === 401) {

          const body = await response.json()
          throw new HTTPError(body.message);
        }
      }
    ]
  },
  // headers: { 'Authorization': `Bearer ${userData}` }
});

export default AdminAuth;