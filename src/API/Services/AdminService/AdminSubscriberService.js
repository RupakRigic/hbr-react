import clientAuth from "../../clientAuth";

export default {
    getSubscriberList:()=> clientAuth.get(`admin/subscriptions/user/list`),
    getSubscriptionPlanList:()=> clientAuth.get(`subscription/index`),
    subscribPaln: (userData) => clientAuth.post(`subscription/user-subscription`, { json: userData }),
};