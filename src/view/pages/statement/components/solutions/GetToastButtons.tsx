import React from 'react';

import { useLanguage } from '@/controllers/hooks/useLanguages';
import Button from '@/view/components/buttons/button/Button';
import { QuestionStage } from 'delib-npm';
import X from '../../../../../assets/icons/x.svg?react';
import LightBulbIcon from '../../../../../assets/icons/lightBulbIcon.svg?react';

interface GetToastButtonsProps {
	questionStage: QuestionStage | undefined;
	setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GetToastButtons({
	questionStage,
	setShowToast,
	setShowModal,
}: GetToastButtonsProps) {
	const { t } = useLanguage();

	switch (questionStage) {
	case QuestionStage.voting:
	case QuestionStage.firstEvaluation:
	case QuestionStage.secondEvaluation:
	case QuestionStage.finished:
	case QuestionStage.explanation:
		return (
			<Button
				text={t('Close')}
				iconOnRight={false}
				onClick={() => {
					setShowToast(false);
				}}
				icon={<X />}
				color='white'
				bckColor='var(--crimson)'
			/>
		);
	case QuestionStage.suggestion:
		return (
			<>
				<Button
					text={t('Close')}
					iconOnRight={false}
					onClick={() => {
						setShowToast(false);
					}}
					icon={<X />}
					color='white'
					bckColor='var(--crimson)'
				/>
				<Button
					text={t('Add a solution')}
					iconOnRight={true}
					onClick={() => {
						setShowToast(false);
						setShowModal(true);
					}}
					icon={<LightBulbIcon />}
					color='white'
					bckColor='var(--green)'
				/>
			</>
		);

	default:
		return (
			<Button
				text={t('Close')}
				iconOnRight={false}
				onClick={() => {
					setShowToast(false);
				}}
				icon={<X />}
				color='white'
				bckColor='var(--crimson)'
			/>
		);
	}
}
