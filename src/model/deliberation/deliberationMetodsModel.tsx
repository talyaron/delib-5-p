import { Method } from "delib-npm";

//icons
import InfoIcon from '@/assets/icons/info.svg?react';
import ClusteringIcon from '@/assets/icons/networkIcon.svg?react';
import EvaluationIcon from '@/assets/icons/evaluations2Icon.svg?react';
import VotingIcon from '@/assets/icons/voting.svg?react';

interface DeliberationMethod {
    title: string;
    defaultImage: JSX.Element;
}

export const deliberationMethodsModel: Record<string, DeliberationMethod> = {
    [Method.explanation]: {
        title: Method.explanation,
        defaultImage: <InfoIcon />,
    },
    [Method.clustering]: {
        title: Method.clustering,
        defaultImage: <ClusteringIcon />,
    },
    [Method.voting]: {
        title: Method.voting,
        defaultImage: <VotingIcon />,
    },
    [Method.suggestions]: {
        title: Method.suggestions,
        defaultImage: <EvaluationIcon />,
    },
    [Method.result]: {
        title: Method.result,
        defaultImage: <EvaluationIcon />,
    },
    [Method.summary]: {
        title: Method.summary,
        defaultImage: <EvaluationIcon />,
    },
    [Method.consultation]: {
        title: Method.consultation,
        defaultImage: <EvaluationIcon />,
    },
    [Method.discussion]: {
        title: Method.discussion,
        defaultImage: <EvaluationIcon />,
    },
}