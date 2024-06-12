import client from "../../client";
import clientAuth from "../../clientAuth";
import axios from "axios";

export default {
    index: (page=1,sortConfig='',searchQuery = '') => clientAuth.get(`admin/subdivision/index?page=${page}${sortConfig}${searchQuery}`),
    update: (id, userData) => clientAuth.post(`admin/subdivision/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/subdivision/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/subdivision/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/subdivision/show/${id}`),
    accessField: () => clientAuth.get(`admin/subdivision/access-fields`),
    manageAccessFields:(userData) =>  clientAuth.post(`admin/subdivision/manage-access-fields`,{ json: userData }),
    getRoleFieldList:()=> clientAuth.get(`admin/subdivision/access-list`),
    export: () => clientAuth.get(`admin/subdivision/export`),
    getByBuilderId: (filterQuery='') => clientAuth.get(`admin/subdivision/list-for-google-map${filterQuery}`),
    import: (formData) => axios.post(`${process.env.REACT_APP_IMAGE_URL}api/admin/subdivision/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem("usertoken"))}`,
        }
    }),
    put: (id, userData) => clientAuth.put(`admin/subdivision/soldout/${id}`, { json: userData }),
    bulkupdate: (id, userData) => clientAuth.put(`admin/subdivision/bulkupdate/${id}`, { json: userData }),
    bulkdestroy: (id) => clientAuth.delete(`admin/subdivision/bulkdestroy/${id}`),
    getByBuilderId: (builderId) => clientAuth.get(`admin/subdivision/bybuilder/${builderId}`),
};