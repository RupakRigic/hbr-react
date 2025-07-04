import client from "../../client";
import clientAuth from "../../clientAuth"

export default {
    index: (page=1,searchQuery = '',sortConfig ='') => clientAuth.get(`admin/builder/index?page=${page}${searchQuery}${sortConfig}`),
    all_builder_list: () => clientAuth.get(`admin/builder/all-builder-list`),
    update: (id, userData) => clientAuth.post(`admin/builder/update/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`admin/builder/destroy/${id}`),
    store: (userData) => clientAuth.post(`admin/builder/store`, { json: userData }),
    show: (id) => clientAuth.get(`admin/builder/show/${id}`),
    accessField: () => clientAuth.get(`admin/builder/access-fields`),
    manageAccessFields:(userData) =>  clientAuth.post(`admin/builder/manage-access-fields`,{ json: userData }),
    getRoleFieldList:(tableName)=> clientAuth.get(`admin/builder/access-list/${tableName}`),    
    import: (userData) => clientAuth.post(`admin/builder/import`, { json: userData }),
    builderDropDown:()=> clientAuth.get(`admin/builder/builder-list-pluck`),
    masterPlanDropDown:()=> clientAuth.get(`admin/trafficsale/get-masterplan-list`),
    bulkupdate: (id, userData) => clientAuth.put(`admin/builder/bulkupdate/${id}`, { json: userData }),
    bulkdestroy: (id) => clientAuth.delete(`admin/builder/bulkdestroy/${id}`),
    archiveDownloadData: (searchQuery = '', userData) => clientAuth.post(`admin/archive/download-data?${searchQuery}`, { json: userData }),
    getArchiveFieldList:(tableName)=> clientAuth.get(`admin/archive/get-fields/${tableName}`),
    getArchiveList:()=> clientAuth.get(`admin/archive/archive-data-list`),
    archive_data_date_range:(id)=> clientAuth.get(`admin/archive/archive-data-date-range/${id}`),
    archive_data_show:(id, userData)=> clientAuth.post(`admin/archive/archive-data/show/${id}`, { json: userData }),
    archive_all_data_update:(id, userData)=> clientAuth.post(`admin/archive/archive-data/update-all-data/${id}`, { json: userData }),
    destroyArchive: (id) => clientAuth.delete(`admin/archive/destroy/${id}`),
    export: (page=1,sortConfig='',searchQuery = '', exportColumn, is_calculated) => clientAuth.post(`admin/builder/export?page=${page}${sortConfig}${searchQuery}${is_calculated}`, { json: exportColumn }),
};