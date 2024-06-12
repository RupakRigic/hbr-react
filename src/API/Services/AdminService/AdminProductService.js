import client from "../../client";
import clientAuth from "../../clientAuth";
import axios from "axios";

export default {
    index: (page=1,sortConfig='',searchQuery = '') => clientAuth.get(`admin/product/index?page=${page}${sortConfig}${searchQuery}`),
    update: (id, userData) => clientAuth.post(`admin/product/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/product/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/product/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/product/show/${id}`),
    accessField: () => clientAuth.get(`admin/product/access-fields`),
    manageAccessFields:(userData) =>  clientAuth.post(`admin/product/manage-access-fields`,{ json: userData }),
    export: () => clientAuth.get(`admin/product/export`),
    getBySubDivisionId: (id) => clientAuth.get(`admin/product/showbysubdivisionid/${id}`),
    import: (formData) => axios.post(`${process.env.REACT_APP_IMAGE_URL}api/admin/product/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem("usertoken"))}`,
        }
    }),
    bulkupdate: (id, userData) => clientAuth.put(`admin/product/bulkupdate/${id}`, { json: userData }),
    bulkdestroy: (id) => clientAuth.delete(`admin/product/bulkdestroy/${id}`),

};