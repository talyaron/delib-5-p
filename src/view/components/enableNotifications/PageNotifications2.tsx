import React, { useState } from 'react';
import "./pageNotifications2.scss";
import pointer1 from "@/assets/images/woman pointing.svg";
import Green1 from "@/assets/icons/green1.svg";
import Elipse3 from "@/assets/icons/Group 2.svg";
import Rectangle from "@/assets/icons/Rectangle 3.svg";
import rectangleText from "@/assets/images/Snackbar2page.svg";
import sentence from "@/assets/images/Enable the Notifications button to grant permission.svg";
import resetpermission from "@/assets/images/reset permission.png";
import link from "@/assets/images/Frame 1171276040.svg";
import xicon from "@/assets/icons/x-icon.svg";
import Modal from "../modal/Modal";
import { Statement } from "delib-npm";

interface Props { statement: Statement | undefined; 
	setCurrentPage: React.Dispatch<React.SetStateAction<number>>; 
	setAskNotifications: React.Dispatch<React.SetStateAction<boolean>>;
	setShowAskPermission: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PageNotifications2({ statement, setCurrentPage, setAskNotifications }: Props) {
	if (!statement) throw new Error("No statement");

	const [isModalOpen, setIsModalOpen] = useState(true);
	
	const handleClose = () => {setAskNotifications(false); setIsModalOpen(false); };
	const handleBack = () => { setCurrentPage(1); };

	return (
		<>
			<div className="enableNotificationspage2" data-cy="enable-notifications-popup">
				{isModalOpen && (
					<Modal>
						<div className="popup">
							<div className="popup-content">
								<div className="popup-header">
									<div className="step-group">
										<img src={Green1} alt="Green1"onClick={handleBack} />
										<img src={Rectangle} alt="Rectangle" className="step" />
										<img src={Elipse3} alt="Ellipse" className="step" />
									</div>
									<div className="icons-close-false">
										<img src={xicon} alt="xicon" onClick={handleClose} />
									</div>
								</div>
								<div className="popup-body">
									<img src={sentence} alt="Sentence" className="desktop-image" />
									<img src={rectangleText} alt="Rectangle" className="mobile-image" />
									<div className="link-wrapper">
										<img src={link} alt="Link" />
									</div>
									<div className="reset-permission">
										<img src={resetpermission} alt="reset-permission" />
									</div>
									<div className="pointer-container">
										<img src={pointer1} alt="Pointer" />
									</div>
									<div className="option-icon-text">
										<p>Turn Notifications on</p>
									</div>
								</div>
								<div className="popup-footer">
									<button className="back-button" onClick={handleBack}>
                                    Back
									</button>
									<button className="finish-button" onClick={handleClose}>
                                    Finish
									</button>
								
								</div>
							</div>
						</div>
					</Modal>
				)}
			</div>
		</>
	);
}
