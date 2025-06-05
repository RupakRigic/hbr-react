import client from "../../client";
import clientAuth from "../../clientAuth"
export default {
    index: (page=1,sortConfig='',searchQuery ='') => clientAuth.get(`admin/scraped-product-prices/index?page=${page}${sortConfig}${searchQuery}`),
    bulkupdate: (id, userData) => clientAuth.put(`admin/price/bulkupdate/${id}`, { json: userData }),
    bulkapprove: (id) => clientAuth.put(`admin/scraped-product-prices/bulkapprove/${id}`),
    accessField: () => clientAuth.get(`admin/scraped-product-prices/access-fields`),
    manageAccessFields:(userData) =>  clientAuth.post(`admin/scraped-product-prices/manage-access-fields`,{ json: userData }),
    bulkupdate: (id, userData) => clientAuth.put(`admin/scraped-product-prices/bulkupdate/${id}`, { json: userData }),

};