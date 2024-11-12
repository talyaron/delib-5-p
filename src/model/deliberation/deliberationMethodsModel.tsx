import { Method } from "delib-npm";

//icons
import InfoIcon from '@/assets/icons/info.svg?react';
import ClusteringIcon from '@/assets/icons/networkIcon.svg?react';
import EvaluationIcon from '@/assets/icons/evaluations2Icon.svg?react';
import VotingIcon from '@/assets/icons/voting.svg?react';
import SummeryIcon from '@/assets/icons/paper.svg?react';
import GravelIcon from '@/assets/icons/gravel.svg?react';
import ChatIcon from '@/assets/icons/chat2.svg?react';
import EarIcon from '@/assets/icons/ear.svg?react';

export interface DeliberationMethod {
    title: string;
    defaultImage: JSX.Element;
    description: string;
}

export const getDeliberationMethod = (method: Method): DeliberationMethod | undefined => {
    switch (method) {
        case Method.explanation:
            return {
                title: Method.explanation,
                defaultImage: <InfoIcon />,
                description: 'Explanation',
            };
        case Method.clustering:
            return {
                title: Method.clustering,
                defaultImage: <ClusteringIcon />,
                description: 'Clustering',
            };
        case Method.voting:
            return {
                title: Method.voting,
                defaultImage: <VotingIcon />,
                description: 'Voting',
            };
        case Method.suggestions:
            return {
                title: Method.suggestions,
                defaultImage: <EvaluationIcon />,
                description: 'Suggestions',
            };
        case Method.consultation:
            return {
                title: Method.consultation,
                defaultImage: <EarIcon />,
                description: 'Consultation',
            };
        case Method.discussion:
            return {
                title: Method.discussion,
                defaultImage: <ChatIcon />,
                description: 'Discussion',
            };
        case Method.result:
            return {
                title: Method.result,
                defaultImage: <GravelIcon />,
                description: 'Result',
            };
        case Method.summary:
            return {
                title: Method.summary,
                defaultImage: <SummeryIcon />,
                description: 'Summary',
            };
        default:
            return undefined;
    }
};

export const getAllDeliberationMethods = (): DeliberationMethod[] => {
    return Object.values(Method).map((method) => getDeliberationMethod(method)).filter((method) => method !== undefined) as DeliberationMethod[];
};
