import client from "../../client";
import clientAuth from "../../clientAuth";
import axios from "axios";

export default {
    index: (page=1,searchQuery = '',sortConfig ='') => clientAuth.get(`admin/builder/index?page=${page}${searchQuery}${sortConfig}`),
    update: (id, userData) => clientAuth.post(`admin/builder/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/builder/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/builder/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/builder/show/${id}`),
    accessField: () => clientAuth.get(`admin/builder/access-fields`),
    manageAccessFields:(userData) =>  clientAuth.post(`admin/builder/manage-access-fields`,{ json: userData }),
    getRoleFieldList:(tableName)=> clientAuth.get(`admin/builder/access-list/${tableName}`),    
    export: () => clientAuth.get(`admin/builder/export`),
    import: (formData) => axios.post(`${process.env.REACT_APP_IMAGE_URL}api/admin/builder/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem("usertoken"))}`, 
        }
    }),
    builderDropDown:()=> clientAuth.get(`admin/builder/builder-list-pluck`),    
    bulkupdate: (id, userData) => clientAuth.put(`admin/builder/bulkupdate/${id}`, { json: userData }),
    bulkdestroy: (id) => clientAuth.delete(`admin/builder/bulkdestroy/${id}`),

};