import { FC, useEffect, useState } from "react";

// Third party imports
import { Statement } from "delib-npm";
import { useParams } from "react-router";
import AddIcon from "@mui/icons-material/Add";
import Modal from "../../../../components/modal/Modal";

// Custom Components
import StatementOptionsNav from "./components/StatementOptionsNav";
import StatementOptionCard from "./components/StatementOptionCard";
import { setStatementOrder } from "../../../../../model/statements/statementsSlice";
import NewSetStatementSimple from "../set/NewStatementSimple";

// Utils & Constants

// Redux Store
import { useAppDispatch } from "../../../../../functions/hooks/reduxHooks";
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
        console.log("Rendering StatementOptions");
    
        const { sort } = useParams();

        const [showModal, setShowModal] = useState(false);
        const [sortedSubStatements, setSortedSubStatements] = useState<
            Statement[]
        >([...subStatements]);

        useEffect(() => {  console.log("rendering useEffect sort");
         
            setSortedSubStatements(() =>  sortSubStatements(subStatements, sort));
        }, [sort, subStatements]);

        let topSum = 50;
        let tops: number[] = [topSum];
        console.log(sortedSubStatements);

        return (
            <ScreenFadeInOut>
                <div className="wrapper">
                    {sortedSubStatements?.map(
                        (statementSub: Statement, i: number) => {
                            //get the top of the element
                            if (statementSub.elementHight) {
                                topSum += statementSub.elementHight + 10;
                                tops.push(topSum);
                            }

                            return (
                                <StatementOptionCard
                                    key={statementSub.statementId}
                                    statement={statementSub}
                                    showImage={handleShowTalker}
                                    top={tops[i]}
                                    index={i}
                                />
                            );
                        }
                    )}
                </div>
                <StatementOptionsNav statement={statement} />
                {showModal && (
                    <Modal>
                        <NewSetStatementSimple
                            parentStatement={statement}
                            isOption={true}
                            setShowModal={setShowModal}
                        />
                    </Modal>
                )}
                <div
                    className="fav fav--fixed"
                    onClick={() => setShowModal(true)}
                >
                    <div>
                        <AddIcon
                            style={{
                                transform: `translate(0px,-40%) scale(1.45)`,
                            }}
                        />
                    </div>
                </div>
            </ScreenFadeInOut>
        );
    } catch (error) {
        console.error(error);
        return null;
    }
};

export default StatementOptions;
