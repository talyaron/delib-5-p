import React, { useState } from 'react';
import "./pageNotifications1.scss";
import pointer1 from "@/assets/images/poiner 1.svg";
import Elipse3 from "@/assets/icons/Group 2.svg";
import Frame from "@/assets/icons/Frame 1171276030.svg";
import Rectangle from "@/assets/icons/Rectangle 3.svg";
import rectangleText from "@/assets/images/Snackbar.svg";
import sentence from "@/assets/images/sentence.svg";
import link from "@/assets/images/Web Settings.svg";
import xicon from "@/assets/icons/x-icon.svg";
import Modal from "../modal/Modal";
import { Statement } from "delib-npm";

interface Props {
  onNext: () => void;
  setAskNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  statement: Statement | undefined;
  setShowAskPermission: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function PageNotifications1({ onNext, setAskNotifications, statement }: Props) {
	if (!statement) throw new Error("No statement");

	const [isModalOpen, setIsModalOpen] = useState(true);

	const handleClose = () => {
		setAskNotifications(false); setIsModalOpen(false);};

	return (
		<>
			<div className="enableNotifications" data-cy="enable-notifications-popup">
				{isModalOpen && (
					<Modal>
						<div className="popup">
							<div className="popup-content">
								<div className="popup-header">
									<div className="step-group">
										<img src={Elipse3} alt="Ellipse" />
										<img src={Rectangle} alt="Rectangle" className="step" />
										<img src={Frame} alt="Frame" className="step" onClick={onNext}/>
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
									<div className="pointer-container">
										<img src={pointer1} alt="Pointer" />
									</div>
									<p className="option-icon-text">
                                    Select the <span className="option-text">Option</span> icon in your browser's address bar
									</p>
								</div>
								<div className="popup-footer">
									<button className="close-button" onClick={handleClose}>
                                    Close
									</button>
									<button className="next-button" onClick={onNext}>
                                    Next
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