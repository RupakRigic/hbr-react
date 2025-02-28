
import clientAuth from "../../clientAuth"
export default {
    index: (page=1,sortConfig='',searchQuery = '') => clientAuth.get(`admin/trafficsale/index?page=${page}${sortConfig}${searchQuery}`),
    update: (id, userData) => clientAuth.post(`admin/trafficsale/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/trafficsale/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/trafficsale/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/trafficsale/show/${id}`),
    accessField: () => clientAuth.get(`admin/trafficsale/access-fields`),
    manageAccessFields:(userData) =>  clientAuth.post(`admin/trafficsale/manage-access-fields`,{ json: userData }),
    bulkupdate: (id, userData) => clientAuth.put(`admin/trafficsale/bulkupdate/${id}`, { json: userData }),
    bulkdestroy: (id) => clientAuth.delete(`admin/trafficsale/bulkdestroy/${id}`),
    import: (userData) => clientAuth.post(`admin/trafficsale/import`, { json: userData }),
    export: (page=1,sortConfig='',searchQuery = '', exportColumn) => clientAuth.post(`admin/trafficsale/export?page=${page}${sortConfig}${searchQuery}`, { json: exportColumn }),
};