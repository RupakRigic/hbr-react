
import clientAuth from "../../clientAuth"
export default {
    index: (page=1,sortConfig='',searchQuery='') => clientAuth.get(`admin/closing/index?page=${page}${sortConfig}${searchQuery}`),
    update: (id, userData) => clientAuth.post(`admin/closing/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/closing/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/closing/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/closing/show/${id}`),
    import: (userData) => clientAuth.post(`admin/closing/import`, { json: userData }),

    accessField: () => clientAuth.get(`admin/closing/access-fields`),
    manageAccessFields:(userData) =>  clientAuth.post(`admin/closing/manage-access-fields`,{ json: userData }),
    export: () => clientAuth.get(`admin/closing/export`),
    bulkupdate: (id, userData) => clientAuth.put(`admin/closing/bulkupdate/${id}`, { json: userData }),
    bulkdestroy: (id) => clientAuth.delete(`admin/closing/bulkdestroy/${id}`),
    ccapnUpdate: (userData) => clientAuth.post(`admin/ccapn/ccapn-update`,{ json: userData }),

};