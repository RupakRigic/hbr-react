import ky from 'ky';

let userData = localStorage.getItem('usertoken') ? localStorage.getItem('usertoken') : "";

class HTTPError extends Error { }
const clientAuth = ky.extend({
  prefixUrl: "http://127.0.0.1:8000/api/",
  // prefixUrl: "http://ec2-54-176-207-251.us-west-1.compute.amazonaws.com/portal/public/api/",
  
  hooks: {
    beforeRequest: [
      (options) => {
        const localHeaders = JSON.parse(localStorage.getItem('usertoken'));

        if (localHeaders) {
          // console.log("token work",localHeaders);
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

export default clientAuth;