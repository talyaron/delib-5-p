import { useNavigate } from "react-router";
import "./page404.scss";
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
        <div className="page404">
            <img
                className="page404__cloud1"
                src="/src/assets/images/Cloud1.png"
                alt="Cloud 1"
            />
            <img
                className="page404__cloud2"
                src="/src/assets/images/Cloud2.png"
                alt="Cloud 2"
            />
            <img
                className="page404__cloud3"
                src="/src/assets/images/Cloud3.png"
                alt="Cloud 3"
            />
            <img
                className="page404__404_textImg"
                src="/src/assets/images/404.png"
                alt="404"
            />
            <div className="page404__cables">
                <img
                    className="page404__cables__CableDog"
                    src="/src/assets/images/CableDog.png"
                    alt="Cable A"
                />
                <img
                    className="page404__cables__Cable"
                    src="/src/assets/images/CableB.png"
                    alt="Cable"
                />
            </div>
            <div className="page404__text">
            <p>Sorry, Page not found!</p>
            </div>
            
            <button className="page404__btn" onClick={handleGoHome}>
                <img
                    className="page404__btnImg"
                    src="/src/assets/images/takeMeHome.png"
                    alt="Take me home"
                />
            </button>
        </div>
    );
};

export default Page404;
