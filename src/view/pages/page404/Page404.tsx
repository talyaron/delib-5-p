import { useNavigate } from "react-router";
import "./page404.scss";
import { useDispatch } from "react-redux";
import { setInitLocation } from "../../../model/location/locationSlice";

//images
import Cloud1 from "../../../assets/images/Cloud1.png";
import Cloud2 from "../../../assets/images/Cloud2.png";
import Cloud3 from "../../../assets/images/Cloud3.png";
import img404 from "../../../assets/images/404.png";
import cable from "../../../assets/images/Cable.png";
import cableDog from "../../../assets/images/CableDog.png";
import { useLanguage } from "../../../controllers/hooks/useLanguages";

const Page404 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {t} = useLanguage();

  function handleGoHome() {
    dispatch(setInitLocation("/home"));
    navigate("/", { state: { from: window.location.pathname } });
  }

  return (
    <div className="page404">
      <img className="page404__cloud1" src={Cloud1} alt="Cloud 1" />
      <img className="page404__cloud2" src={Cloud2} alt="Cloud 2" />
      <img className="page404__cloud3" src={Cloud3} alt="Cloud 3" />
      <img className="page404__404_textImg" src={img404} alt="404" />
      <div className="page404__cables">
        <img
          className="page404__cables__CableDog"
          src={cableDog}
          alt="Cable A"
        />
        <img className="page404__cables__Cable" src={cable} alt="Cable" />
      </div>
      <div className="page404__text">
        <p>{t("Sorry, Page not found")}</p>
      </div>

      <button className="page404__btn" onClick={handleGoHome}>
      <p>{t("Take me home")}</p>
      </button>
    </div>
  );
};

export default Page404;
