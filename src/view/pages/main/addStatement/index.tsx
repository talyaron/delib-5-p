// Third party imports
import { Link } from "react-router-dom";

// Custom components
import StatementSettings from "../../statement/components/settings/StatementSettings";
import useDirection from "../../../../functions/hooks/useDirection";
import ScreenSlide from "../../../components/animation/ScreenSlide";
import BackArrowIcon from "../../../components/icons/BackArrowIcon";

export const AddStatement = () => {
    const direction = useDirection();

    return (
        <ScreenSlide className="page slide-out">
            <div
                className="page__header"
                style={{
                    flexDirection: direction,
                    justifyContent: "space-between",
                    paddingTop: ".5rem",
                }}
            >
                <Link
                    to={"/home"}
                    state={{ from: window.location.pathname }}
                    className="setStatement__back"
                >
                    {" "}
                    <BackArrowIcon color="black" />
                </Link>
                <h1>{("Add New Group")}</h1>
                <span></span>
            </div>
            <StatementSettings />
        </ScreenSlide>
    );
};

export default AddStatement;
