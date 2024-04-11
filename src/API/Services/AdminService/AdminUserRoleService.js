import client from "../../client";
import clientAuth from "../../clientAuth"
export default {
    index: (searchQuery = '') => clientAuth.get(`admin/user/index${searchQuery}`),
    update: (id, userData) => clientAuth.post(`admin/user/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/user/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/user/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/user/show/${id}`),
    roles: () => clientAuth.get(`admin/user/roles`),
    accessField: () => clientAuth.get(`admin/user/access-fields`),
    manageAccessFields:(userData) =>  clientAuth.post(`admin/user/manage-access-fields`,{ json: userData }),

};