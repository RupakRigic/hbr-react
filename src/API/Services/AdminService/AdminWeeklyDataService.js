import clientAuth from "../../clientAuth"
export default {
    index: (weekending,builderId) => clientAuth.get(`admin/weekly/index/${weekending}/${builderId}`),
    update: (id, userData) => clientAuth.post(`admin/weekly/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/weekly/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/weekly/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/weekly/show/${id}`),
    getdate:()=> clientAuth.get(`admin/weekly/getdate`),
    put: (id, userData) => clientAuth.put(`admin/weekly/update-column/${id}`, { json: userData }),
    getstatistics: (type,startDate ,endDate) => clientAuth.get(`admin/weekly/getstatistics?type=${type}&from=${startDate}&to=${endDate}`),
    update_all_data: (date, userData) => clientAuth.post(`admin/weekly/update-all-data/${date}`, { json: userData }),
};