
import clientAuth from "../../clientAuth";
import axios from "axios";

export default {
    index: (page=1,sortConfig='',searchQuery='') => clientAuth.get(`admin/closing/index?page=${page}${sortConfig}${searchQuery}`),
    update: (id, userData) => clientAuth.post(`admin/closing/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/closing/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/closing/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/closing/show/${id}`),
    import: (formData) => axios.post(`${process.env.REACT_APP_IMAGE_URL}api/admin/closing/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem("usertoken"))}`,
        }
    }),
    accessField: () => clientAuth.get(`admin/closing/access-fields`),
    manageAccessFields:(userData) =>  clientAuth.post(`admin/closing/manage-access-fields`,{ json: userData }),
    export: () => clientAuth.get(`admin/closing/export`),
    bulkupdate: (id, userData) => clientAuth.put(`admin/closing/bulkupdate/${id}`, { json: userData }),
    bulkdestroy: (id) => clientAuth.delete(`admin/closing/bulkdestroy/${id}`),


};