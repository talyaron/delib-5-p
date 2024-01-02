import { Statement } from "delib-npm";
import { FC } from "react";
import Text from "../../../../components/text/Text";
import { t } from "i18next";

interface Props {
    statement: Statement |null;
    setShowInfo: Function;
}

const StatementInfo: FC<Props> = ({ statement,setShowInfo }) => {
    if (!statement) return null;

    return <div>
        <h3 style={{textAlign:"center"}}>{t("Information")}</h3>
        <Text text={statement.statement} />
        <div className="btns">
            <div className="btn" onClick={()=>setShowInfo(false)}>
                OK
            </div>
        </div>
        </div>;
};

export default StatementInfo;
