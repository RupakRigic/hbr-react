import { SVGICON } from "../../constant/theme";

export const DataUploaderSubscribeMenuList = [
    {
        title: 'Builders',
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

export const DataUploaderMenuList = [
    {
        title: 'Dashboard',
        iconStyle: SVGICON.HomeSvg,
        to: '/dashboard',
    },
    {
        title: 'Builders',
        iconStyle: SVGICON.Pages,
        to: '/filterbuilder',

    },
    {
        title: 'Subdivisions',
        iconStyle: SVGICON.Finance,
        to: '/filtersubdivision',
    },
    {
        title: 'Products',
        iconStyle: SVGICON.CoreHr,
        to: '/filterproducts',
    },
    {
        title: 'Weekly Traffic & Sales',
        iconStyle: SVGICON.GridDots,
        to: '/filterweeklytrafficandsales',
    },
    {
        title: 'Base Prices',
        iconStyle: SVGICON.Pages,
        to: '/filterbaseprice',

    },
    {
        title: 'Reports',
        iconStyle: SVGICON.GridDots,
        to: '/report',
    },
    {
        title: 'Archive Data',
        iconStyle: SVGICON.ArchiveData,
        to: '/downloading-archive-data',
    },
    {
        title: 'Subscription',
        iconStyle: SVGICON.SubscribeData,
        to: '/subscriptionlist',
    }
]