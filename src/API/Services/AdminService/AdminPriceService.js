import client from "../../client";
import clientAuth from "../../clientAuth"
export default {
    index: (searchQuery ='') => clientAuth.get(`admin/price/index${searchQuery}`),
    update: (id, userData) => clientAuth.post(`admin/price/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/price/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/price/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/price/show/${id}`),
    import: (userData) => clientAuth.post(`admin/price/import`, { json: userData }),

};