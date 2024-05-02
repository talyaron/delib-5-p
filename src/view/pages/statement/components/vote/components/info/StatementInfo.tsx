import { Statement } from "delib-npm";
import { FC, useState } from "react";
import {
    getDescription,
    getTitle,
    isAuthorized,
} from "../../../../../../../controllers/general/helpers";
import Text from "../../../../../../components/text/Text";
import { handleSubmitInfo } from "./StatementInfoCont";

//image
import info from "../../../../../../../assets/images/info.svg";
import EditIcon from "../../../../../../../assets/icons/editIcon.svg?react";

import styles from "./StatementInfo.module.scss";
import { useAppSelector } from "../../../../../../../controllers/hooks/reduxHooks";
import {
    statementSelector,
    statementSubscriptionSelector,
} from "../../../../../../../model/statements/statementsSlice";

interface Props {
    statement: Statement | null;
    setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

const StatementInfo: FC<Props> = ({ statement, setShowInfo }) => {
    if (!statement) return null;

    const statementSubscription = useAppSelector(
        statementSubscriptionSelector(statement.statementId),
    );
    const parentStatement = useAppSelector(
        statementSelector(statement.parentId),
    );

    const [edit, setEdit] = useState(false);

    const title = getTitle(statement);
    const description = getDescription(statement);
    const _isAuthorized = isAuthorized(
        statement,
        statementSubscription,
        parentStatement?.creatorId,
    );

    return (
        <div className={styles.info}>
            <div className={styles.image}>
                <img src={info} alt="info" />
            </div>
            <div className={styles.texts}>
                {!edit ? (
                    <>
                        <h3>
                            {title}
                            {_isAuthorized && (
                                <EditIcon
                                    style={{ color: "#226CBC", width: "24px" }}
                                    onClick={() => setEdit(true)}
                                />
                            )}
                        </h3>
                        <div className={styles.text}>
                            <Text text={description} />
                        </div>
                        <div className="btns">
                            <div
                                className="btn btn--agree "
                                onClick={() => setShowInfo(false)}
                            >
                                OK
                            </div>
                        </div>
                    </>
                ) : (
                    <form
                        className={styles.form}
                        onSubmit={(e: any) =>
                            handleSubmitInfo(e, statement, setEdit, setShowInfo)
                        }
                    >
                        <input
                            type="text"
                            defaultValue={title}
                            name="title"
                            required={true}
                        />
                        <textarea
                            defaultValue={description}
                            name="description"
                        />
                        <div className="btns">
                            <button className="btn btn--agree ">Save</button>
                            <div
                                className="btn btn--disagree"
                                onClick={() => setEdit(false)}
                            >
                                Cancel
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default StatementInfo;
