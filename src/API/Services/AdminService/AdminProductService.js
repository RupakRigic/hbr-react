import client from "../../client";
import clientAuth from "../../clientAuth"
export default {
    index: (page=1,sortConfig='',searchQuery = '') => clientAuth.get(`admin/product/index?page=${page}${sortConfig}${searchQuery}`),
    update: (id, userData) => clientAuth.post(`admin/product/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/product/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/product/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/product/show/${id}`),
    accessField: () => clientAuth.get(`admin/product/access-fields`),
    manageAccessFields:(userData) =>  clientAuth.post(`admin/product/manage-access-fields`,{ json: userData }),
    getBySubDivisionId: (id) => clientAuth.get(`admin/product/showbysubdivisionid/${id}`),
    import: (userData) => clientAuth.post(`admin/product/import`, { json: userData }),
    bulkupdate: (id, userData) => clientAuth.put(`admin/product/bulkupdate/${id}`, { json: userData }),
    bulkdestroy: (id) => clientAuth.delete(`admin/product/bulkdestroy/${id}`),
    productDropDown:()=> clientAuth.get(`admin/product/list/dropdown`),
    export: (page=1,sortConfig='',searchQuery = '', exportColumn, is_calculated) => clientAuth.post(`admin/product/export?page=${page}${sortConfig}${searchQuery}${is_calculated}`, { json: exportColumn }),
};