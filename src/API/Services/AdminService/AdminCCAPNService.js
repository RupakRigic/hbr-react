import client from "../../client";
import clientAuth from "../../clientAuth"

export default {
    index: (page=1,searchQuery = '',sortConfig ='') => clientAuth.get(`admin/ccapn/index?page=${page}${searchQuery}${sortConfig}`),
    import: (userData) => clientAuth.post(`admin/ccapn/import`, { json: userData }),
    manageAccessFields:(userData) =>  clientAuth.post(`admin/ccapn/manage-access-fields`,{ json: userData }),
};