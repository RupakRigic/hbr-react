import client from "../../client";
import clientAuth from "../../clientAuth"

export default {
    index: (searchQuery = '',) => clientAuth.get(`admin/builder/index${searchQuery}`),
    update: (id, userData) => clientAuth.post(`admin/builder/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/builder/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/builder/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/builder/show/${id}`),
    accessField: () => clientAuth.get(`admin/builder/access-fields`),
};