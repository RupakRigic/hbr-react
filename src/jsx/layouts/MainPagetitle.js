import React,{useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';


import { SVGICON } from '../constant/theme';

const MainPagetitle = ({pageTitle, parentTitle, mainTitle, link}) => {

    return (
        <>
            <div className="page-titles">
				<ol className="breadcrumb">
					<li><h5 className="bc-title">{mainTitle}</h5></li>
					<li className="breadcrumb-item">
                        <Link to={link ? link : "#"}>
						    {SVGICON.HomeSvg}
						    {" "}{parentTitle} 
                        </Link>
					</li>
					<li className="breadcrumb-item active"><Link to={"#"}>{pageTitle}</Link></li>
				</ol>
				
			</div>  
			
        </>
    );
};

export default MainPagetitle;