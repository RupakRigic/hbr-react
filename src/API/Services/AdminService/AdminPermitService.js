import client from "../../client";
import clientAuth from "../../clientAuth"
export default {
    index: (searchQuery = '') => clientAuth.get(`admin/permit/index${searchQuery}`),
    update: (id, userData) => clientAuth.post(`admin/permit/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/permit/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/permit/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/permit/show/${id}`),
    import: (userData) => clientAuth.post(`admin/permit/import`, { json: userData }),

};