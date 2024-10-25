import { SVGICON } from "../../constant/theme";

export const DataUploaderMenuList = [
    {
        title: 'Builders',
        // classsChange: 'mm-collapse',
        iconStyle: SVGICON.Pages,
        to: '/builderList',

    },
    {
        title: 'Weekly Data',
        iconStyle: SVGICON.GridDots,
        to: '/weekly-data',
    },
    {
        title: 'Subscription',
        iconStyle: SVGICON.SubscribeData,
        to: '/subscriptionlist',
    },

]