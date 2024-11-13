import SelectWithImages from '@/view/components/selectWithImages/SelectWithImages';
import { useEffect, useState } from 'react';
import {
	DeliberationMethod,
	getAllDeliberationMethods,
} from '@/model/deliberation/deliberationMethodsModel';
import { useLanguage } from '@/controllers/hooks/useLanguages';
import Button, { ButtonType } from '@/view/components/buttons/button/Button';
import { setStageToDB } from '@/controllers/db/stages/setStage';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { statementSelector } from '@/model/statements/statementsSlice';
import { setStage } from '@/model/stages/stagesSlice';

const NewStage = () => {
    const dispatch = useDispatch();
	const { t } = useLanguage();
	const { statementId } = useParams();
	const statement = useSelector(statementSelector(statementId));

	const selectMethods = getAllDeliberationMethods();
	const [selectedOption, setSelectedOption] =
		useState<DeliberationMethod | null>(null);
	const [alternativeName, setAlternativeName] = useState<string | null>(null);

	useEffect(() => {
		if (selectedOption) {
			setAlternativeName(selectedOption.title);
		}
	}, [selectedOption]);
	try {
		function handleSetStageName(
			e:
				| React.ChangeEvent<HTMLInputElement>
				| React.KeyboardEvent<HTMLInputElement>
		) {
			if (e.target instanceof HTMLInputElement) {
				setAlternativeName(e.target.value);
			}
		}

		async function handleSetStageToDB() {
			try {
				if (!statement) throw new Error('No statement found');
				if (!selectedOption) throw new Error('No method selected');

				const newStage = await setStageToDB({
					statement: statement,
					deliberationMethod: selectedOption,
				});
                if (!newStage) throw new Error('Error creating stage');
                dispatch(setStage(newStage));
                
			} catch (error) {
				console.error(error);
			}
		}

		return (
			<div className="stage">
				<h3>New Stage</h3>
				<SelectWithImages
					options={selectMethods}
					selectedOption={selectedOption}
					setSelectedOption={setSelectedOption}
				/>
				<input
					type="text"
					defaultValue={
						alternativeName !== null ? t(alternativeName) : undefined
					}
					placeholder={t('Stage Name')}
					onKeyUp={handleSetStageName}
					onBlur={handleSetStageName}
				/>
				{selectedOption && (
					<Button
						buttonType={ButtonType.SECONDARY}
						text={t('Add Stage')}
						onClick={handleSetStageToDB}
					/>
				)}
			</div>
		);
	} catch (error) {
		console.error(error);

		return null;
	}
};

export default NewStage;
