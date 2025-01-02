import { useContext } from 'react'
import { StatementContext } from '../../../StatementCont'
import Document from './document/Document'
import { QuestionStagesType } from 'delib-npm'
import SuggestionCards from '../../evaluations/components/suggestionCards/SuggestionCards'
import SimpleQuestion from './simpleQuestion/SimpleQuestion'


const QuestionPage = () => {
	const { statement } = useContext(StatementContext);
	const questionType: QuestionStagesType | undefined = statement?.questionSettings?.stagesType;
	console.log("questionType", questionType)

	if (questionType === QuestionStagesType.document) return <Document />
	if (!questionType || questionType === QuestionStagesType.singleStage) return <SimpleQuestion />
	return null
}

export default QuestionPage


