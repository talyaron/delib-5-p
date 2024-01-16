import { Statement } from "delib-npm";
import { FC } from "react";
import Text from "../../../../components/text/Text";

interface Props {
    statement: Statement | null;
    setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

const StatementInfo: FC<Props> = ({ statement, setShowInfo }) => {
    if (!statement) return null;

    return (
        <div>
            <h3 style={{ textAlign: "center" }}>{"Information"}</h3>
            <Text text={statement.statement} />
            <div className="btns">
                <div className="btn" onClick={() => setShowInfo(false)}>
                    OK
                </div>
            </div>
        </div>
    );
};

export default StatementInfo;
