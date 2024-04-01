import client from "../../client";
import clientAuth from "../../clientAuth"
export default {
    index: (searchQuery='') => clientAuth.get(`admin/landsale/index${searchQuery}`),
    update: (id, userData) => clientAuth.post(`admin/landsale/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/landsale/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/landsale/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/landsale/show/${id}`),
    import: (userData) => clientAuth.post(`admin/landsale/import`, { json: userData }),

};