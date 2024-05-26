import { useNavigate } from "react-router";
import img404 from "../../../assets/images/404.jpg";
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
                className="page404__vector1"
                src="/src/assets/images/Vector1.png"
                alt="vector 1"
            />
            <img
                className="page404__vector2"
                src="/src/assets/images/Vector2.png"
                alt="vector 2"
            />
            <img
                className="page404__vector3"
                src="/src/assets/images/Vector3.png"
                alt="vector 3"
            />
            <img
                className="page404__404"
                src="/src/assets/images/404.png"
                alt="404"
            />
            <div className="page404__cables">
                <img
                    className="page404__cables__Cable_A"
                    src="/src/assets/images/CableA.png"
                    alt="Cable A"
                />
                <img
                    className="page404__cables__Cable_B"
                    src="/src/assets/images/CableB.png"
                    alt="Cable B"
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
