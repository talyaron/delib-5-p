import { useContext } from 'react'
import { StatementContext } from '../../../StatementCont'
import Document from './document/Document'
import { QuestionStagesType } from 'delib-npm'
import SuggestionCards from '../../evaluations/components/suggestionCards/SuggestionCards'


const QuestionPage = () => {
	const { statement } = useContext(StatementContext);
	const questionType: QuestionStagesType | undefined = statement?.questionSettings?.stagesType;


	if (questionType === QuestionStagesType.document) return <Document />
	if (!questionType || questionType === QuestionStagesType.singleStage) return <SuggestionCards />
	return null
}

export default QuestionPage


