import clientAuth from "../../clientAuth"
export default {
    index: (userData) => clientAuth.get(`admin/weekly/index/${userData}`),
    update: (id, userData) => clientAuth.post(`admin/weekly/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/weekly/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/weekly/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/weekly/show/${id}`),
    getdate:()=> clientAuth.get(`admin/weekly/getdate`),
    put: (id, userData) => clientAuth.put(`admin/weekly/update-column/${id}`, { json: userData }),
    getstatistics: () => clientAuth.get(`admin/weekly/getstatistics`),

};