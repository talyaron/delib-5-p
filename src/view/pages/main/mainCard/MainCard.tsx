import { Statement } from "delib-npm";
import { FC } from "react";
import Text from "../../../components/text/Text";

import StatementChatMore from "../../statement/components/chat/components/StatementChatMore";

interface Props {
    statement: Statement;
}

const MainCard: FC<Props> = ({ statement }) => {
    return (
        <div
            className="mainCard"
            style={{ borderLeft: `.625rem solid ${statement.color}` }}
        >
            <Text text={statement.statement} />
            <StatementChatMore statement={statement} color={"gray"} />
        </div>
    );
};

export default MainCard;
