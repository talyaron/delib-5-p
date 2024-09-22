import "./style.scss";
import image from "@/assets/images/MemberRsejectionImage.png";
import { logOut } from "@/controllers/db/auth";


export default function MemberRejection() {
	const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
	

	return (
		<div className="memberRejectionPage">
			<div className="memberRejectionPage__wrapper">
				<img
					src={image}
					alt="member-rejection-image"
					width={isMobile ? "90%" : "50%"}
				/>
				<p className="memberRejectionPage__wrapper__apologize">
                    We apologize for the inconvenience
				</p>
				<p
					className="memberRejectionPage__wrapper__explanation"
					style={{ width: isMobile ? "80%" : "60%" }}
				>
                    unfortunately participation in this group is restricted at
                    this time
				</p>
				<p className="memberRejectionPage__wrapper__action">
                    please get in touch with the group admin for inquiries about
                    your participation status
				</p>
				<button className="btn" onClick={() => logOut()}>
                    Back home
				</button>
			</div>
		</div>
	);
}
