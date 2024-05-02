import { FC, useEffect, useState } from "react";

// Third party imports
import { Statement, StatementType, User } from "delib-npm";
import { useParams } from "react-router";
import Modal from "../../../../components/modal/Modal";

// Utils & Helpers
import { sortSubStatements } from "./statementEvaluationCont";
import { isOptionFn } from "../../../../../controllers/general/helpers";

// Custom Components
import StatementEvaluationCard from "./components/StatementEvaluationCard";
import NewSetStatementSimple from "../set/NewStatementSimple";
import StatementBottomNav from "../nav/bottom/StatementBottomNav";

interface Props {
    statement: Statement;
    subStatements: Statement[];
    handleShowTalker: (talker: User | null) => void;
    showNav?: boolean;
    questions?: boolean;
    toggleAskNotifications: () => void;
}

const StatementEvaluation: FC<Props> = ({
    statement,
    subStatements,
    handleShowTalker,
    questions = false,
    toggleAskNotifications,
}) => {
    try {
        // Hooks
        const { sort } = useParams();

        // Use States
        const [showModal, setShowModal] = useState(false);
        const [sortedSubStatements, setSortedSubStatements] = useState<
            Statement[]
        >([...subStatements]);

        useEffect(() => {
            setSortedSubStatements(() =>
                sortSubStatements(subStatements, sort).filter((s) => {
                    if (questions) {
                        return s.statementType === StatementType.question;
                    }

                    return isOptionFn(s);
                }),
            );
        }, [sort, subStatements]);

        // Variables
        let topSum = 30;
        const tops: number[] = [topSum];

        return (
            <>
                <div className="page__main">
                    <div className="wrapper">
                        {sortedSubStatements?.map(
                            (statementSub: Statement, i: number) => {
                                //get the top of the element
                                if (statementSub.elementHight) {
                                    topSum += statementSub.elementHight + 30;
                                    tops.push(topSum);
                                }

                                return (
                                    <StatementEvaluationCard
                                        key={statementSub.statementId}
                                        parentStatement={statement}
                                        statement={statementSub}
                                        showImage={handleShowTalker}
                                        top={tops[i]}
                                    />
                                );
                            },
                        )}
                        <div
                            className="options__bottom"
                            style={{ height: `${topSum + 70}px` }}
                        ></div>
                    </div>
                </div>

                <div className="page__footer">
                    <StatementBottomNav
                        setShowModal={setShowModal}
                        statement={statement}
                    />
                </div>
                {showModal && (
                    <Modal>
                        <NewSetStatementSimple
                            parentStatement={statement}
                            isOption={questions ? false : true}
                            setShowModal={setShowModal}
                            toggleAskNotifications={toggleAskNotifications}
                        />
                    </Modal>
                )}
            </>
        );
    } catch (error) {
        console.error(error);

        return null;
    }
};

export default StatementEvaluation;
