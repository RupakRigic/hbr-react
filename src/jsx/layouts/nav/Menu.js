import { SVGICON } from "../../constant/theme";

const userRole = JSON.parse(localStorage.getItem("user"))?.role;

export const MenuList = [
    {
        title: 'Dashboard',
        iconStyle: SVGICON.Home,
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
        iconStyle: SVGICON.Pages,
        to: '/filterbaseprice',
    },
    {
        title: 'Scrap Price List',
        iconStyle: SVGICON.Pages,
        to: '/scrapepricelist',
    },
    {
        title: 'Closings',
        iconStyle: SVGICON.CoreHr,
        to: '/filterclosings',
    },
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
    {
        title: 'Subscribers',
        iconStyle: SVGICON.SubscribeData,
        to: '/subscriberlist',
    },
];

export const TesterMenuList = [
    {
        title: 'Dashboard',
        iconStyle: SVGICON.Home,
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
        iconStyle: SVGICON.Pages,
        to: '/filterbaseprice',
    },
    {
        title: 'Scrap Price List',
        iconStyle: SVGICON.Pages,
        to: '/scrapepricelist',
    },
    {
        title: 'Closings',
        iconStyle: SVGICON.CoreHr,
        to: '/filterclosings',
    },
    {
        title: 'Land Sales',
        iconStyle: SVGICON.ProjectsSidbar,
        to: '/filterlandsales',
    },
]
