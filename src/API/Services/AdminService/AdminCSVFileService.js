import client from "../../client";
import clientAuth from "../../clientAuth"

export default {
    index: (searchQuery = '') => clientAuth.get(`admin/csvfile/index${searchQuery}`),
    update: (id, userData) => clientAuth.post(`admin/csvfile/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/csvfile/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/csvfile/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/csvfile/show/${id}`),
    accessField: () => clientAuth.get(`admin/csvfile/access-fields`),
    manageAccessFields:(userData) =>  clientAuth.post(`admin/csvfile/manage-access-fields`,{ json: userData }),

};