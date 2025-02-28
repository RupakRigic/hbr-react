import client from "../../client";
import clientAuth from "../../clientAuth"
export default {
    index: (page=1,sortConfig='',searchQuery='') => clientAuth.get(`admin/landsale/index?page=${page}${sortConfig}${searchQuery}`),
    update: (id, userData) => clientAuth.post(`admin/landsale/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/landsale/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/landsale/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/landsale/show/${id}`),
    import: (userData) => clientAuth.post(`admin/landsale/import`, { json: userData }),
    accessField: () => clientAuth.get(`admin/landsale/access-fields`),
    manageAccessFields:(userData) =>  clientAuth.post(`admin/landsale/manage-access-fields`,{ json: userData }),
    bulkupdate: (id, userData) => clientAuth.put(`admin/landsale/bulkupdate/${id}`, { json: userData }),
    bulkdestroy: (id) => clientAuth.delete(`admin/landsale/bulkdestroy/${id}`),
    export: (page=1,sortConfig='',searchQuery = '', exportColumn) => clientAuth.post(`admin/landsale/export?page=${page}${sortConfig}${searchQuery}`, { json: exportColumn }),
};