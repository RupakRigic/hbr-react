import client from "../../client";
import clientAuth from "../../clientAuth"
export default {
    index: (page=1,sortConfig='',searchQuery ='') => clientAuth.get(`admin/price/index?page=${page}${sortConfig}${searchQuery}`),
    update: (id, userData) => clientAuth.post(`admin/price/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/price/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/price/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/price/show/${id}`),
    import: (userData) => clientAuth.post(`admin/price/import`, { json: userData }),
    accessField: () => clientAuth.get(`admin/price/access-fields`),
    manageAccessFields:(userData) =>  clientAuth.post(`admin/price/manage-access-fields`,{ json: userData }),
    export: () => clientAuth.get(`admin/price/export`),
    import: (userData) => clientAuth.post(`admin/product/import`, { json: userData }),
    bulkupdate: (id, userData) => clientAuth.put(`admin/price/bulkupdate/${id}`, { json: userData }),

};