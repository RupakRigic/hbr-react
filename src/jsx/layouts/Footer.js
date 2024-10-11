import React from "react";

const Footer = () => {
	var d = new Date();
	return (
		<div className="footer out-footer" style={{marginTop: "0%"}}>
			<div className="copyright">
				<p> © {d.getFullYear()} {" "} Website Developed by{" "}
					<a href="https://www.rigicglobalsolutions.com/" target="_blank"  rel="noreferrer">
					Rigic Global Solutions Pvt Ltd
					</a>{" "} All Rights Reserved
					
				</p>
			</div>
		</div>
	);
};

export default Footer;
