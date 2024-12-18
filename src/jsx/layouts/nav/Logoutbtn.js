import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminUserService from '../../../API/Services/AdminService/AdminUserService';

const LogoutPage = () => {
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      const data = await AdminUserService.logout().json();
      if (data.status == true) {
        localStorage.removeItem("is_subscribed");
        localStorage.removeItem("subscription_end_at");
        localStorage.removeItem("subscriptionActivePlan");
        localStorage.removeItem("subscription_data_types");
        // Builder
        localStorage.removeItem("selectedBuilderNameByFilterBuilder");
        localStorage.removeItem("selectedStatusByBuilderFilterBuilder");
        localStorage.removeItem("selectedCompanyTypeByFilterBuilder");
        localStorage.removeItem("builder_name_Builder");
        localStorage.removeItem("is_active_Builder");
        localStorage.removeItem("active_communities_Builder");
        localStorage.removeItem("company_type_Builder");
        localStorage.removeItem("searchQueryByBuilderFilter_Builder");
        localStorage.removeItem("setBuilderFilter");

        // Subdivision
        localStorage.removeItem("selectedStatusBySubdivisionFilter_Subdivision");
        localStorage.removeItem("selectedReportingByFilter_Subdivision");
        localStorage.removeItem("selectedBuilderNameByFilter_Subdivision");
        localStorage.removeItem("productTypeStatusByFilter_Subdivision");
        localStorage.removeItem("selectedAreaByFilter_Subdivision");
        localStorage.removeItem("selectedMasterPlanByFilter_Subdivision");
        localStorage.removeItem("selectedAgeByFilter_Subdivision");
        localStorage.removeItem("selectedSingleByFilter_Subdivision");
        localStorage.removeItem("selectedGatedByFilter_Subdivision");
        localStorage.removeItem("selectedJurisdicitionByFilter_Subdivision");
        localStorage.removeItem("seletctedGasProviderByFilter_Subdivision");
        localStorage.removeItem("subdivision_status_Subdivision");
        localStorage.removeItem("reporting_Subdivision");
        localStorage.removeItem("subdivision_name_Subdivision");
        localStorage.removeItem("builder_name_Subdivision");
        localStorage.removeItem("product_type_Subdivision");
        localStorage.removeItem("area_Subdivision");
        localStorage.removeItem("masterplan_id_Subdivision");
        localStorage.removeItem("zipcode_Subdivision");
        localStorage.removeItem("lotwidth_Subdivision");
        localStorage.removeItem("lotsize_Subdivision");
        localStorage.removeItem("age_Subdivision");
        localStorage.removeItem("single_Subdivision");
        localStorage.removeItem("gated_Subdivision");
        localStorage.removeItem("juridiction_Subdivision");
        localStorage.removeItem("gasprovider_Subdivision");
        localStorage.removeItem("from_Subdivision");
        localStorage.removeItem("to_Subdivision");
        localStorage.removeItem("searchQueryBySubdivisionFilter_Subdivision");
        localStorage.removeItem("setSubdivisionFilter");

        // Product
        localStorage.removeItem("selectedStatusByProductFilter_Product");
        localStorage.removeItem("selectedBuilderNameByFilter_Product");
        localStorage.removeItem("selectedSubdivisionNameByFilter_Product");
        localStorage.removeItem("selectedAgeByFilter_Product");
        localStorage.removeItem("selectedSingleByFilter_Product");
        localStorage.removeItem("product_status_Product");
        localStorage.removeItem("builder_name_Product");
        localStorage.removeItem("subdivision_name_Product");
        localStorage.removeItem("product_name_Product");
        localStorage.removeItem("sqft_Product");
        localStorage.removeItem("stories_Product");
        localStorage.removeItem("bedroom_Product");
        localStorage.removeItem("bathroom_Product");
        localStorage.removeItem("garage_Product");
        localStorage.removeItem("current_base_price_Product");
        localStorage.removeItem("product_type_Product");
        localStorage.removeItem("area_Product");
        localStorage.removeItem("masterplan_id_Product");
        localStorage.removeItem("zipcode_Product");
        localStorage.removeItem("lotwidth_Product");
        localStorage.removeItem("lotsize_Product");
        localStorage.removeItem("age_Product");
        localStorage.removeItem("single_Product");
        localStorage.removeItem("searchQueryByProductFilter_Product");
        localStorage.removeItem("setProductFilter");

        // Permit
        localStorage.removeItem("selectedBuilderNameByFilter_Permit");
        localStorage.removeItem("selectedSubdivisionNameByFilter_Permit");
        localStorage.removeItem("productTypeStatusByFilter_Permit");
        localStorage.removeItem("selectedAreaByFilter_Permit");
        localStorage.removeItem("selectedMasterPlanByFilter_Permit");
        localStorage.removeItem("selectedAgeByFilter_Permit");
        localStorage.removeItem("selectedSingleByFilter_Permit");
        localStorage.removeItem("from_Permit");
        localStorage.removeItem("to_Permit");
        localStorage.removeItem("builder_name_Permit");
        localStorage.removeItem("subdivision_name_Permit");
        localStorage.removeItem("address2_Permit");
        localStorage.removeItem("address1_Permit");
        localStorage.removeItem("parcel_Permit");
        localStorage.removeItem("sqft_Permit");
        localStorage.removeItem("lotnumber_Permit");
        localStorage.removeItem("permitnumber_Permit");
        localStorage.removeItem("plan_Permit");
        localStorage.removeItem("product_type_Permit");
        localStorage.removeItem("area_Permit");
        localStorage.removeItem("masterplan_id_Permit");
        localStorage.removeItem("zipcode_Permit");
        localStorage.removeItem("lotwidth_Permit");
        localStorage.removeItem("lotsize_Permit");
        localStorage.removeItem("age_Permit");
        localStorage.removeItem("single_Permit");
        localStorage.removeItem("searchQueryByPermitsFilter");
        localStorage.removeItem("setPermitFilter");

        // Weekly Traffic & Sales
        localStorage.removeItem("selectedBuilderNameByFilter_TrafficSale");
        localStorage.removeItem("selectedSubdivisionNameByFilter_TrafficSale");
        localStorage.removeItem("productTypeStatusByFilter_TrafficSale");
        localStorage.removeItem("selectedAreaByFilter_TrafficSale");
        localStorage.removeItem("selectedMasterPlanByFilter_TrafficSale");
        localStorage.removeItem("selectedAgeByFilter_TrafficSale");
        localStorage.removeItem("selectedSingleByFilter_TrafficSale");
        localStorage.removeItem("from_TrafficSale");
        localStorage.removeItem("to_TrafficSale");
        localStorage.removeItem("builder_name_TrafficSale");
        localStorage.removeItem("subdivision_name_TrafficSale");
        localStorage.removeItem("weeklytraffic_TrafficSale");
        localStorage.removeItem("cancelations_TrafficSale");
        localStorage.removeItem("netsales_TrafficSale");
        localStorage.removeItem("totallots_TrafficSale");
        localStorage.removeItem("lotreleased_TrafficSale");
        localStorage.removeItem("unsoldinventory_TrafficSale");
        localStorage.removeItem("product_type_TrafficSale");
        localStorage.removeItem("area_TrafficSale");
        localStorage.removeItem("masterplan_id_TrafficSale");
        localStorage.removeItem("zipcode_TrafficSale");
        localStorage.removeItem("lotwidth_TrafficSale");
        localStorage.removeItem("lotsize_TrafficSale");
        localStorage.removeItem("zoning_TrafficSale");
        localStorage.removeItem("age_TrafficSale");
        localStorage.removeItem("single_TrafficSale");
        localStorage.removeItem("searchQueryByWeeklyTrafficFilter");
        localStorage.removeItem("setTrafficFilter");
        
        // Base Price
        localStorage.removeItem("selectedBuilderNameByFilter_BasePrice");
        localStorage.removeItem("selectedSubdivisionNameByFilter_BasePrice");
        localStorage.removeItem("productTypeStatusByFilter_BasePrice");
        localStorage.removeItem("selectedAreaByFilter_BasePrice");
        localStorage.removeItem("selectedMasterPlanByFilter_BasePrice");
        localStorage.removeItem("selectedAgeByFilter_BasePrice");
        localStorage.removeItem("selectedSingleByFilter_BasePrice");
        localStorage.removeItem("selectedStatusBySubdivisionFilter_BasePrice");
        localStorage.removeItem("selectedStatusByProductFilter_BasePrice");
        localStorage.removeItem("from_BasePrice");
        localStorage.removeItem("to_BasePrice");
        localStorage.removeItem("builder_name_BasePrice");
        localStorage.removeItem("subdivision_name_BasePrice");
        localStorage.removeItem("product_name_BasePrice");
        localStorage.removeItem("sqft_BasePrice");
        localStorage.removeItem("stories_BasePrice");
        localStorage.removeItem("bedroom_BasePrice");
        localStorage.removeItem("bathroom_BasePrice");
        localStorage.removeItem("garage_BasePrice");
        localStorage.removeItem("baseprice_BasePrice");
        localStorage.removeItem("product_type_BasePrice");
        localStorage.removeItem("area_BasePrice");
        localStorage.removeItem("masterplan_id_BasePrice");
        localStorage.removeItem("zipcode_BasePrice");
        localStorage.removeItem("lotwidth_BasePrice");
        localStorage.removeItem("lotsize_BasePrice");
        localStorage.removeItem("age_BasePrice");
        localStorage.removeItem("single_BasePrice");
        localStorage.removeItem("product_status_BasePrice");
        localStorage.removeItem("subdivision_status_BasePrice");
        localStorage.removeItem("searchQueryByBasePricesFilter");
        localStorage.removeItem("setBasePriceFilter");

        // Closing
        localStorage.removeItem("seletctedClosingTypeByFilter_Closing");
        localStorage.removeItem("selectedBuilderNameByFilter_Closing");
        localStorage.removeItem("selectedSubdivisionNameByFilter_Closing");
        localStorage.removeItem("seletctedLenderByFilter_Closing");
        localStorage.removeItem("productTypeStatusByFilter_Closing");
        localStorage.removeItem("selectedAreaByFilter_Closing");
        localStorage.removeItem("selectedMasterPlanByFilter_Closing");
        localStorage.removeItem("selectedAgeByFilter_Closing");
        localStorage.removeItem("selectedSingleByFilter_Closing");
        localStorage.removeItem("from_Closing");
        localStorage.removeItem("to_Closing");
        localStorage.removeItem("closing_type_Closing");
        localStorage.removeItem("document_Closing");
        localStorage.removeItem("builder_name_Closing");
        localStorage.removeItem("subdivision_name_Closing");
        localStorage.removeItem("closingprice_Closing");
        localStorage.removeItem("address_Closing");
        localStorage.removeItem("parcel_Closing");
        localStorage.removeItem("sellerleagal_Closing");
        localStorage.removeItem("buyer_Closing");
        localStorage.removeItem("lender_name_Closing");
        localStorage.removeItem("loanamount_Closing");
        localStorage.removeItem("product_type_Closing");
        localStorage.removeItem("area_Closing");
        localStorage.removeItem("masterplan_id_Closing");
        localStorage.removeItem("zipcode_Closing");
        localStorage.removeItem("lotwidth_Closing");
        localStorage.removeItem("lotsize_Closing");
        localStorage.removeItem("age_Closing");
        localStorage.removeItem("single_Closing");
        localStorage.removeItem("searchQueryByClosingsFilter");
        localStorage.removeItem("setClosingFilter");

        // Land Sale
        localStorage.removeItem("selectedBuilderNameByFilter_LandSale");
        localStorage.removeItem("selectedSubdivisionNameByFilter_LandSale");
        localStorage.removeItem("from_LandSale");
        localStorage.removeItem("to_LandSale");
        localStorage.removeItem("builder_name_LandSale");
        localStorage.removeItem("subdivision_name_LandSale");
        localStorage.removeItem("seller_LandSale");
        localStorage.removeItem("buyer_LandSale");
        localStorage.removeItem("location_LandSale");
        localStorage.removeItem("notes_LandSale");
        localStorage.removeItem("price_LandSale");
        localStorage.removeItem("priceperunit_LandSale");
        localStorage.removeItem("parcel_LandSale");
        localStorage.removeItem("document_LandSale");
        localStorage.removeItem("noofunit_LandSale");
        localStorage.removeItem("typeofunit_LandSale");
        localStorage.removeItem("searchQueryByLandSalesFilter");
        localStorage.removeItem("setLansSaleFilter");
        navigate('/');
      } else {
        console.log(data.message);
      }
    } catch (error) {

    }
  };
  
  return (
    <Fragment>
      <button className="btn btn-primary btn-sm" onClick={onLogout}>Logout</button>
    </Fragment>
  )
};

export default LogoutPage;