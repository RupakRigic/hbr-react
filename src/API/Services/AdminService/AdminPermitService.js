import client from "../../client";
import clientAuth from "../../clientAuth"
import axios from "axios";

export default {
    index: (page=1,sortConfig='', searchQuery = '') => clientAuth.get(`admin/permit/index?page=${page}${sortConfig}${searchQuery}`),
    update: (id, userData) => clientAuth.post(`admin/permit/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/permit/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/permit/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/permit/show/${id}`),
    import: (userData) => clientAuth.post(`admin/permit/import`, { json: userData }),
    accessField: () => clientAuth.get(`admin/permit/access-fields`),
    manageAccessFields:(userData) =>  clientAuth.post(`admin/permit/manage-access-fields`,{ json: userData }),
    export: () => clientAuth.get(`admin/permit/export`),
    import: (formData) => axios.post(`${process.env.REACT_APP_IMAGE_URL}api/admin/permit/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem("usertoken"))}`, // Assuming the token is stored in localStorage
        }
      }),
    bulkupdate: (id, userData) => clientAuth.put(`admin/permit/bulkupdate/${id}`, { json: userData }),
    bulkdestroy: (id) => clientAuth.delete(`admin/permit/bulkdestroy/${id}`),

};