import client from "../../client";
import clientAuth from "../../clientAuth"
export default {
    index: (page=1, sortConfig='', userData) => clientAuth.post(`admin/user/index?page=${page}${sortConfig}`, { json: userData }),
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
    activity_log: (page=1, id, userData) => clientAuth.post(`admin/user/all/activity/${id}?page=${page}`, { json: userData }),
    notify_user_list: (page=1, userData) => clientAuth.post(`admin/notify/user/list?page=${page}`, { json: userData }),
    notify_user_store: (userData) => clientAuth.post(`admin/notify/user/store`, { json: userData }),
    export: (page=1, sortConfig='', exportColumn) => clientAuth.post(`admin/user/export?page=${page}${sortConfig}`, { json: exportColumn }),
};