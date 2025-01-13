import { useContext } from 'react'
import { StatementContext } from '../../../StatementCont'
import Document from './document/Document'
import SimpleQuestion from './simpleQuestion/SimpleQuestion'

const QuestionPage = () => {
	const { statement } = useContext(StatementContext);
	const isDocument: boolean | undefined = statement?.questionSettings?.isDocument;

	if (isDocument) return <Document />
	return <SimpleQuestion />

	return null
}

export default QuestionPage
