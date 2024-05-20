
import clientAuth from "../../clientAuth"
export default {
    index: (page=1,sortConfig='',searchQuery = '') => clientAuth.get(`admin/trafficsale/index?page=${page}${sortConfig}${searchQuery}`),
    update: (id, userData) => clientAuth.post(`admin/trafficsale/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/trafficsale/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/trafficsale/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/trafficsale/show/${id}`),
    accessField: () => clientAuth.get(`admin/trafficsale/access-fields`),
    manageAccessFields:(userData) =>  clientAuth.post(`admin/trafficsale/manage-access-fields`,{ json: userData }),
    export: () => clientAuth.get(`admin/trafficsale/export`),
    bulkupdate: (id, userData) => clientAuth.put(`admin/trafficsale/bulkupdate/${id}`, { json: userData }),

};