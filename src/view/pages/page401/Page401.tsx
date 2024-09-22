import "./page401.scss";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setInitLocation } from "@/model/location/locationSlice";

const Page401 = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	function handleGoHome() {
		dispatch(setInitLocation("/home"));
		navigate("/", { state: { from: window.location.pathname } });
	}

	return (
		<div className="page401">
			<img
				className="page401__titleImg"
				src="/src/assets/images/401-error.png"
				alt="Title 404 Img"
			/>
			<img
				className="page401__img"
				src="/src/assets/images/401-img.png"
				alt="Dog tangled in cables"
			/>
			<p className="page401__stamp">
                From the Institute for Deliberative Democracy
			</p>
			<button className="page401__btn" onClick={handleGoHome}>
                Go to Homepage
			</button>
		</div>
	);
};

export default Page401;
