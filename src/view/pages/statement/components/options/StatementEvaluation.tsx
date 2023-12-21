import { FC, useEffect, useState } from "react";

// Third party imports
import { Statement } from "delib-npm";
import { useParams } from "react-router";
import Modal from "../../../../components/modal/Modal";

// Custom Components
import StatementEvaluationCard from "./components/StatementEvaluationCard";
import NewSetStatementSimple from "../set/NewStatementSimple";
import ScreenFadeInOut from "../../../../components/animation/ScreenFadeInOut";

// Utils & Constants

// Redux Store
import { sortSubStatements } from "./statementEvaluationCont";
import { isOptionFn } from "../../../../../functions/general/helpers";
import StatementEvaluationNav from "./components/StatementEvaluationNav";



interface Props {
    statement: Statement;
    subStatements: Statement[];
    handleShowTalker: Function;
    showNav?: boolean;
}

const StatementEvaluation: FC<Props> = ({
    statement,
    subStatements,
    handleShowTalker,
}) => {
    try {
        const { sort } = useParams();

        const [showModal, setShowModal] = useState(false);
        const [sortedSubStatements, setSortedSubStatements] = useState<
            Statement[]
        >([...subStatements]);

        useEffect(() => {
            setSortedSubStatements(() =>
                sortSubStatements(subStatements, sort).filter((s) =>
                    isOptionFn(s)
                )
            );
        }, [sort, subStatements]);

        let topSum = 10;
        let tops: number[] = [topSum];


        return (
            <ScreenFadeInOut className="page__main">
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
                        }
                    )}
                </div>
                <div className="page__main__bottom">
                    <StatementEvaluationNav
                        setShowModal={setShowModal}
                        statement={statement}
                    />
                </div>
                {/* {addOption?<Fav onclick={handleAddStatement} isHome={false} />:null} */}
                {showModal && (
                    <Modal>
                        <NewSetStatementSimple
                            parentStatementId={statement.statementId}
                            isOption={true}
                            setShowModal={setShowModal}
                        />
                    </Modal>
                )}
            </ScreenFadeInOut>
        );
    } catch (error) {
        console.error(error);
        return null;
    }
};

export default StatementEvaluation;
