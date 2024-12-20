import clientAuth from "../../clientAuth";

export default {
    index: (page=1) => clientAuth.get(`admin/ccapn/index?page=${page}`),
    manageAccessFields:(userData) =>  clientAuth.post(`admin/ccapn/manage-access-fields`,{ json: userData }),
    bulkupdate: (id, userData) => clientAuth.put(`admin/ccapn/bulkupdate/${id}`, { json: userData }),
};