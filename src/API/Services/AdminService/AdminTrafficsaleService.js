
import clientAuth from "../../clientAuth"
export default {
    index: (searchQuery = '') => clientAuth.get(`admin/trafficsale/index${searchQuery}`),
    update: (id, userData) => clientAuth.post(`admin/trafficsale/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/trafficsale/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/trafficsale/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/trafficsale/show/${id}`),


};