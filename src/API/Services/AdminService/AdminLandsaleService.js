import client from "../../client";
import clientAuth from "../../clientAuth";
import axios from "axios";

export default {
    index: (page=1,sortConfig='',searchQuery='') => clientAuth.get(`admin/landsale/index?page=${page}${sortConfig}${searchQuery}`),
    update: (id, userData) => clientAuth.post(`admin/landsale/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/landsale/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/landsale/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/landsale/show/${id}`),
    import: (formData) => axios.post(`${process.env.REACT_APP_IMAGE_URL}api/admin/landsale/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem("usertoken"))}`,
        }
    }),
    accessField: () => clientAuth.get(`admin/landsale/access-fields`),
    manageAccessFields:(userData) =>  clientAuth.post(`admin/landsale/manage-access-fields`,{ json: userData }),
    export: () => clientAuth.get(`admin/landsale/export`),
    bulkupdate: (id, userData) => clientAuth.put(`admin/landsale/bulkupdate/${id}`, { json: userData }),
    bulkdestroy: (id) => clientAuth.delete(`admin/landsale/bulkdestroy/${id}`),

};