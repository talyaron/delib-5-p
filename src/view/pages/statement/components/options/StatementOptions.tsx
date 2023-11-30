import { FC, useEffect, useState } from "react";

// Third party imports
import { Statement } from "delib-npm";
import { useParams } from "react-router";
import Modal from "../../../../components/modal/Modal";

// Custom Components
import StatementOptionsNav from "./components/StatementOptionsNav";
import StatementOptionCard from "./components/StatementOptionCard";
import NewSetStatementSimple from "../set/NewStatementSimple";

// Utils & Constants

// Redux Store
import { sortSubStatements } from "./statementOptionsCont";
import ScreenFadeInOut from "../../../../components/animation/ScreenFadeInOut";
import { isOptionFn } from "../../../../../functions/general/helpers";


interface Props {
    statement: Statement;
    subStatements: Statement[];
    handleShowTalker: Function;
    showNav?: boolean;
}

const StatementOptions: FC<Props> = ({
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
                                topSum += statementSub.elementHight + 20;
                                tops.push(topSum);
                            }

                            return (
                                <StatementOptionCard
                                    key={statementSub.statementId}
                                    statement={statementSub}
                                    showImage={handleShowTalker}
                                    top={tops[i]}
                                />
                            );
                        }
                    )}
                </div>
                <div
                    className="page__main__bottom"
                    style={{ marginBottom: "10vh" }}
                >
                    <StatementOptionsNav
                        setShowModal={setShowModal}
                        statement={statement}
                    />
                </div>
                {/* <Fav onclick={handleAddStatment} /> */}
                {showModal && (
                    <Modal>
                        <NewSetStatementSimple
                            parentStatement={statement}
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

export default StatementOptions;
