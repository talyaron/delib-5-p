import { membersAllowed, Statement } from "delib-npm";
import { FC } from "react";
import Text from "@/view/components/text/Text";
import Triangle from "@/view/components/triangle/Triangle";

interface Props {
  statement: Statement;
}

const Info: FC<Props> = ({ statement }) => {
	//detect if local or production
	const isLocal = process.env.NODE_ENV === "development";
	const isAnonymous =
    statement.membership?.typeOfMembersAllowed === membersAllowed.all;

	const anonymousUrl = isLocal
		? `http://localhost:5174/doc-anonymous/${statement.statementId}`
		: `https://freedis.web.app/doc-anonymous/${statement.statementId}`;

	const memberUrl = isLocal
		? `http://localhost:5174/doc/${statement.statementId}`
		: `https://freedis.web.app/doc/${statement.statementId}`;

	return (
	
		<div className="wrapper">
			{statement.description && (
				<>
					<h2>Description</h2>
					<Text description={statement.description} />
				</>
			)}
			<ul>
				{isAnonymous && (
					<li>
						<a href={anonymousUrl} target="_blank">
                Anonymous Link
						</a>
					</li>
				)}
				<li>
					<a href={memberUrl} target="_blank">
              members Link
					</a>
				</li>
			</ul>

			<Triangle statement={statement} />
		</div>
		
	);
};

export default Info;
