import ky from 'ky';
class HTTPError extends Error {}
const client = ky.extend({
    prefixUrl: "http://localhost/hbr/public/api/",
  // prefixUrl: "https://vegasdata.homes/portal/public/api/",
  hooks: {
    beforeRequest: [
      (request) => {
        // Do something before every request
        // This is a good place to authorize request if needed
      }
    ],
    afterResponse: [
			// Or retry with a fresh token on a 403 error
			async (request, options, response) => {
				if (response.status === 401) {
          console.log("client",response);
          const body = await response.json()
          throw new HTTPError(body.message);
				}
			}
    ]
  }
});

export default client;