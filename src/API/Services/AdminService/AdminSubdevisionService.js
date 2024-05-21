import client from "../../client";
import clientAuth from "../../clientAuth"
export default {
    index: (page=1,sortConfig='',searchQuery = '') => clientAuth.get(`admin/subdivision/index?page=${page}${sortConfig}${searchQuery}`),
    update: (id, userData) => clientAuth.post(`admin/subdivision/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/subdivision/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/subdivision/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/subdivision/show/${id}`),
    accessField: () => clientAuth.get(`admin/subdivision/access-fields`),
    manageAccessFields:(userData) =>  clientAuth.post(`admin/subdivision/manage-access-fields`,{ json: userData }),
    getRoleFieldList:()=> clientAuth.get(`admin/subdivision/access-list`),
    export: () => clientAuth.get(`admin/subdivision/export`),
    getByBuilderId: (filterQuery='') => clientAuth.get(`admin/subdivision/list-for-google-map   ${filterQuery}`),
    import: (userData) => clientAuth.post(`admin/subdivision/import`, { json: userData }),
    put: (id, userData) => clientAuth.put(`admin/subdivision/soldout/${id}`, { json: userData }),
    bulkupdate: (id, userData) => clientAuth.put(`admin/subdivision/bulkupdate/${id}`, { json: userData }),

};