// Third party imports
import { Link, useParams } from "react-router-dom";

// Custom components

import useDirection from "../../../../../functions/hooks/useDirection";
import ScreenSlide from "../../../../components/animation/ScreenSlide";
import BackArrowIcon from "../../../../components/icons/BackArrowIcon";
import StatementSettings from "../settings/StatementSettings";

export const SetStatement = () => {
    const { statementId } = useParams();

    const direction = useDirection();

    return (
        <ScreenSlide className="setStatement slide-out">
            <div
                className="setStatement__header"
                style={{ flexDirection: direction }}
            >
                <Link
                    to={"/home"}
                    state={{ from: window.location.pathname }}
                    className="setStatement__back"
                >
                    {" "}
                    <BackArrowIcon color="black" />
                </Link>
                <h1>{statementId ? ("Update") : ("Add New Group")}</h1>
                <span></span>
            </div>
            <div className="page__main">
                <StatementSettings />
            </div>
        </ScreenSlide>
    );
};

export default SetStatement;
