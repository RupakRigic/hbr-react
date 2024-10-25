import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import LogoutPage from './Logout';

import { IMAGES, SVGICON } from "../../constant/theme";
import Logoutbtn from "./Logoutbtn";



const Header = ({ onNote }) => {
	const [headerFix, setheaderFix] = useState(false);
	const navigate = useNavigate();
	const [userData, setUserData] = useState('');
	useEffect(() => {
		if (localStorage.getItem('usertoken')) {
			setUserData(JSON.parse(localStorage.getItem('user')))

		}
		else {
			localStorage.removeItem('user')
			localStorage.removeItem("usertoken");
			localStorage.removeItem("is_subscribed");
			navigate('/');
		}
		window.addEventListener("scroll", () => {
			setheaderFix(window.scrollY > 50);
		});


	}, []);


	return (
		<div className={`header ${headerFix ? "is-fixed" : ""}`}>
			<div className="header-content">
				<nav className="navbar navbar-expand">
					<div className="collapse navbar-collapse justify-content-between">
						<div className="header-left">
							<div className="input-group search-area">

							</div>
						</div>
						<ul className="navbar-nav header-right">


							<li className="nav-item align-items-center header-border">
								<Logoutbtn />
							</li>
							<li className="nav-item ps-3">
								<Dropdown className="header-profile2">
									<Dropdown.Toggle className="nav-link i-false" as="div">
										<div className="header-info2 d-flex align-items-center">
											<div className="header-media">
												<img src={IMAGES.Tab1} alt="" />
											</div>
											<div className="header-info">
												<h6>{userData.displayName}</h6>
												<p>{userData.email}</p>
											</div>

										</div>
									</Dropdown.Toggle>
									{/* <Dropdown.Menu align="end">
										<div className="card border-0 mb-0">
											<div className="card-header py-2">
												<div className="products">
													<img src={IMAGES.Tab1} className="avatar avatar-md" alt="" />
													<div>
														<h6>Thomas Fleming</h6>

													</div>
												</div>
											</div>
											<div className="card-body px-0 py-2">
												<Link to={"#"} className="dropdown-item ai-icon ">
													{SVGICON.User}{" "}
													<span className="ms-2">Profile </span>
												</Link>
												<Link to={"#"} className="dropdown-item ai-icon ">
													{SVGICON.Project}{" "}
													<span className="ms-2">My Project</span><span className="badge badge-sm badge-secondary light rounded-circle text-white ms-2">4</span>
												</Link>
												<Link to={"#"} className="dropdown-item ai-icon ">
													{SVGICON.Message}{" "}
													<span className="ms-2">Message </span>
												</Link>
												<Link to={"/#"} className="dropdown-item ai-icon ">
													{SVGICON.Notification} {" "}
													<span className="ms-2">Notification </span>
												</Link>
											</div>
											<div className="card-footer px-0 py-2">
												<Link to={"#"} className="dropdown-item ai-icon ">
													{SVGICON.Headersetting} {" "}
													<span className="ms-2">Settings </span>
												</Link>
												<LogoutPage />
											</div>
										</div>

									</Dropdown.Menu> */}
								</Dropdown>
							</li>
						</ul>


					</div>
				</nav>
			</div>
		</div>
	);
};

export default Header;
