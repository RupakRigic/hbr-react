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
        to: '/filterproducts',
    },

    {
        title: 'Permits',
        iconStyle: SVGICON.Performance,
        to: '/filterpermits',
    },

    {
        title: 'Weekly Traffic & Sales',
        iconStyle: SVGICON.GridDots,
        to: '/filterweeklytrafficandsales',
    },
    {
        title: 'Base Prices',
        // classsChange: 'mm-collapse',
        iconStyle: SVGICON.Pages,
        to: '/filterbaseprice',

    },
    {
        title: 'Closings',
        iconStyle: SVGICON.CoreHr,
        to: '/filterclosings',
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
    {
        title: 'Archive Data',
        iconStyle: SVGICON.ArchiveData,
        to: '/downloading-archive-data',
    },
]