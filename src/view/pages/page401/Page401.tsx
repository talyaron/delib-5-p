import "./page401.scss";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setInitLocation } from "../../../model/location/locationSlice";

const Page401 = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function handleGoHome() {
        dispatch(setInitLocation("/home"));
        navigate("/", { state: { from: window.location.pathname } });
    }

    return (
        <div>
            <div className="btns">
                <button
                    className="btn btn--large btn--add"
                    onClick={handleGoHome}
                >
                    Go to Homepage
                </button>
            </div>
        </div>
    );
};

export default Page401;
