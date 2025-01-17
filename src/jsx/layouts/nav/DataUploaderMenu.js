import { SVGICON } from "../../constant/theme";

export const CommanDataType = [
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
];

export const WeeklyTrafficAndSales_ProductPricing = [
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

    }
];

export const NewHomeClosings = [
    {
        title: 'Closings',
        iconStyle: SVGICON.CoreHr,
        to: '/filterclosings',
    }
];

export const NewHomePermits = [
    {
        title: 'Permits',
        iconStyle: SVGICON.Performance,
        to: '/filterpermits',
    }
];

export const LandSales = [
    {
        title: 'Land Sales',
        iconStyle: SVGICON.ProjectsSidbar,
        to: '/filterlandsales',
    },
];

const userRole = JSON.parse(localStorage.getItem("user")).role;
export const DataUploaderMenuList = [
    // {
    //     title: 'Subscription',
    //     iconStyle: SVGICON.SubscribeData,
    //     to: '/subscriptionlist',
    // },
    {
        title: 'Data Reporting',
        iconStyle: SVGICON.GridDots,
        to: '/weekly-data',
    }
];

export const AccountAdminafterSubscribed = [
    // {
    //     title: 'Subscription',
    //     iconStyle: SVGICON.SubscribeData,
    //     to: '/subscriptionlist',
    // },
    // {
    //     title: 'Data Reporting',
    //     iconStyle: SVGICON.GridDots,
    //     to: '/weekly-data',
    // }

    {
        title: 'Users',
        iconStyle: SVGICON.User,
        to: '/userlist/accountadmin',
    },
];
