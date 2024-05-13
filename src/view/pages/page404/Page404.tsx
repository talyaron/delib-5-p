import { useNavigate } from "react-router";
import img404 from "../../../assets/images/404.jpg";
import styles from "./page404.module.scss";
import { useDispatch } from "react-redux";
import { setInitLocation } from "../../../model/location/locationSlice";

const Page404 = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	function handleGoHome() {
		dispatch(setInitLocation("/home"));
		navigate("/", { state: { from: window.location.pathname } });
	}

	return (
		<div className={styles.page}>
			<div className={styles.box}>
				<img src={img404} alt="404" />
				<div className="btns">
					<button
						className="btn btn--large btn--add"
						onClick={handleGoHome}
					>
                        Go Home
					</button>
				</div>
				<div className={styles.credit}>
					<span>Image by</span>
					<a href="https://www.freepik.com/free-vector/404-error-web-template-with-funny-monster_2548710.htm#query=404%20page&position=6&from_view=keyword&track=ais&uuid=d49b3627-e951-464f-b780-aa6012b5ed9e">
                        Freepik
					</a>
				</div>
			</div>
		</div>
	);
};

export default Page404;
