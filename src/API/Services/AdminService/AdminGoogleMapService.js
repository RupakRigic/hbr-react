import client from "../../client";
import clientAuth from "../../clientAuth"
export default {
    showbybuilderid: (builderId) => clientAuth.get(`admin/subdivision/list-for-google-map/${builderId}`),
};