import { SVGICON } from "../../constant/theme";

export const MenuList = [
    //Content

    //Dashboard
    {
        title: 'Dashboard',
        // classsChange: 'mm-collapse',
        iconStyle: SVGICON.Home,
        to: '/dashboard',

    },
    {
        title: 'Builders',
        // classsChange: 'mm-collapse',
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
        to: '/productlist',
    },

    {
        title: 'Permits',
        iconStyle: SVGICON.Performance,
        to: '/permitlist',
    },

    {
        title: 'Weekly Traffic & Sales',
        iconStyle: SVGICON.GridDots,
        to: '/trafficsalelist',
    },
    {
        title: 'Base Prices',
        // classsChange: 'mm-collapse',
        iconStyle: SVGICON.Pages,
        to: '/priceList',

    },
    {
        title: 'Closings',
        iconStyle: SVGICON.CoreHr,
        to: '/closingsalelist',
    },
    // {
    //     title: 'Statistics',
    //     iconStyle: SVGICON.ProjectsSidbar,
    //     to: '/statistics',
    // },

    {
        title: 'Land Sales',
        iconStyle: SVGICON.ProjectsSidbar,
        to: '/filterlandsales',
    },
    {
        title: 'Reports',
        iconStyle: SVGICON.GridDots,
        to: '/report',
    },
    {
        title: 'Files',
        iconStyle: SVGICON.Finance,
        to: '/files',
    },

    {
        title: 'Users',
        iconStyle: SVGICON.User,
        to: '/userlist',
    },
    {
        title: 'Data Reporting',
        iconStyle: SVGICON.GridDots,
        to: '/weekly-data',
    },
    {
        title: 'CCAPNs',
        iconStyle: SVGICON.GridDots,
        to: '/ccapn',
    },
]