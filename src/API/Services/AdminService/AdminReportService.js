import client from "../../client";
import clientAuth from "../../clientAuth"
export default {   
    index: (userData) => clientAuth.post(`admin/report/generate-reports`, { json: userData }),
    update: (id, userData) => clientAuth.post(`admin/product/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/report/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/product/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/product/show/${id}`),
    pdfExport: (userData) => clientAuth.post(`admin/report/export-reports`,{ json: userData } ),
    reportList:()=>clientAuth.get(`admin/report/index`),
    pdfSave:(userData)=>clientAuth.post(`admin/report/save-reports`,{ json: userData }),
    destroyReport:(id)=>clientAuth.delete(`admin/report/destroy-report/${id}`),
    uploadReport:(userData)=>clientAuth.post(`admin/report/upload-report`,{json:userData}),
    weekending_date_list:()=>clientAuth.get(`admin/report/weekending-date-list`)
};