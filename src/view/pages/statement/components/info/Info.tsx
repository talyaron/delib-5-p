import { Statement } from "delib-npm";
import { FC } from "react";
import InfoParser from "@/view/components/InfoParser/InfoParser";


interface Props {
  statement: Statement;
}

const Info: FC<Props> = ({ statement }) => {

//detect if local or production
const isLocal = process.env.NODE_ENV === "development";
console.log(isLocal);

const url = isLocal ? `http://localhost:5174/doc/${statement.statementId}` : `https://freedis.web.app/doc/${statement.statementId}`;

	return (
		<div>
			<div className="wrapper">
				<InfoParser statement={statement} />
				<a href={url} target="_blank">To Document</a>
			</div>
		</div>
	);
};

export default Info;
