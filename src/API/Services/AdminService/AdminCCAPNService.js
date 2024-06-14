import clientAuth from "../../clientAuth";

export default {
    index: (page=1,searchQuery = '',sortConfig ='') => clientAuth.get(`admin/ccapn/index?page=${page}${searchQuery}${sortConfig}`),
    manageAccessFields:(userData) =>  clientAuth.post(`admin/ccapn/manage-access-fields`,{ json: userData }),
    bulkupdate: (id, userData) => clientAuth.put(`admin/ccapn/bulkupdate/${id}`, { json: userData }),
};