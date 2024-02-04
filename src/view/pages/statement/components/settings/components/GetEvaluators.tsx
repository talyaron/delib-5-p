import React from "react";
import { Evaluation } from "delib-npm";
import Chip from "../../../../../components/chip/Chip";
import { handleGetEvaluators } from "../statementSettingsCont";

export default function GetEvaluators({
    statementId,
}: {
    statementId: string | undefined;
}) {
    const [evaluators, setEvaluators] = React.useState<Evaluation[]>([]);
    const [clicked, setClicked] = React.useState(false);

    return (
        statementId && (
            <section className="settings__getUsers">
                <button
                    type="button"
                    className="settings__getUsers__evaluatorsBtn formBtn"
                    onClick={() =>
                        handleGetEvaluators(
                            statementId,
                            setEvaluators,
                            setClicked,
                        )
                    }
                >
                    Get Evaluators
                </button>
                <div className="settings__getUsers__chipBox">
                    {evaluators.length > 0
                        ? evaluators.map((evaluator) => {
                              return (
                                  <Chip
                                      key={evaluator.evaluationId}
                                      user={evaluator.evaluator}
                                  />
                              );
                          })
                        : clicked && (
                              <p style={{ marginTop: 20 }}>
                                  No evaluators found
                              </p>
                          )}
                </div>
                {clicked && <b>{evaluators.length} Evaluated</b>}
            </section>
        )
    );
}
