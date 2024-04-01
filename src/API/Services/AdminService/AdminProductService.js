import client from "../../client";
import clientAuth from "../../clientAuth"
export default {
    index: (searchQuery = '') => clientAuth.get(`admin/product/index${searchQuery}`),
    update: (id, userData) => clientAuth.post(`admin/product/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/product/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/product/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/product/show/${id}`),


};