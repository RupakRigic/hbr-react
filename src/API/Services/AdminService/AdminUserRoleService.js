import client from "../../client";
import clientAuth from "../../clientAuth"
export default {
    index: (page=1,sortConfig='',searchQuery = '') => clientAuth.get(`admin/user/index?page=${page}${sortConfig}${searchQuery}`),
    update: (id, userData) => clientAuth.post(`admin/user/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/user/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/user/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/user/show/${id}`),
    roles: () => clientAuth.get(`admin/user/roles`),
    accessField: () => clientAuth.get(`admin/user/access-fields`),
    manageAccessFields:(userData) =>  clientAuth.post(`admin/user/manage-access-fields`,{ json: userData }),
    bulkupdate: (id, userData) => clientAuth.put(`admin/user/bulkupdate/${id}`, { json: userData }),
    bulkdestroy: (id) => clientAuth.delete(`admin/user/bulkdestroy/${id}`),
    checkBuilderForCompany: (userData) => clientAuth.post(`admin/user/check-company-builder`, { json: userData }),
    userloginanalytics: (page=1, id) => clientAuth.get(`admin/user/user-login-activity/${id}?page=${page}`),
    userlogoutnanalytics: (page=1, id) => clientAuth.get(`admin/user/user-logout-activity/${id}?page=${page}`),
    activity_log: (id, userData) => clientAuth.get(`admin/user/activity/log/${id}`, { json: userData }),
};