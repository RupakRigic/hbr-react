import clientAuth from "../../clientAuth";

export default {
    getSubscriberList:()=> clientAuth.get(`admin/subscriptions/user/list`),
    getSubscriptionList:()=> clientAuth.get(`subscription/subscription-list`),
    getSubscriptionPlanList:()=> clientAuth.get(`subscription/index`),
    subscribPaln: (userData) => clientAuth.post(`subscription/user-subscription`, { json: userData }),
    subscribCancel: (Id) => clientAuth.post(`subscription/cancel-subscription/${Id}`),
    getActiveSubscriptionPlan:()=> clientAuth.get(`subscription/active-subscription`),
};