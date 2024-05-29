
import LightBulbIcon from "../../assets/icons/lightBulbIcon.svg?react";
import ArrowUp from "../../assets/icons/arrowUpIcon.svg?react";
import EvaluationsIcon from "../../assets/icons/evaluations2Icon.svg?react";
import HandIcon from "../../assets/icons/handIcon.svg?react";
import FlagIcon from "../../assets/icons/flagIcon.svg?react";
import { QuestionStage } from "delib-npm";

export const questionStages = {
    [QuestionStage.suggestion]: {
      name: "Suggestion",
      icon:  LightBulbIcon,
      color: "--settings-suggestions",
    },
    [QuestionStage.firstEvaluation]: {
      name: "First Evaluation",
      icon: EvaluationsIcon,
      color: "--settings-first-evaluation",
    },
    [QuestionStage.secondEvaluation]: {
      name: "Second Evaluation",
      icon: ArrowUp,
      color: "--settings-second-evaluation",
    },
    [QuestionStage.voting]: {
      name: "Voting",
      icon: HandIcon,
      color: "--settings-voting",
    },
    [QuestionStage.finished]: {
      name: "Finished",
      icon: FlagIcon,
      color: "--settings-finished",
    },
  };