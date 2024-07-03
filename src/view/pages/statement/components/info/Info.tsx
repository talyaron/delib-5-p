import { Statement } from "delib-npm";
import { FC } from "react";
import InfoParser from "../../../../components/InfoParser/InfoParser";

interface Props {
  statement: Statement;
}

const Info: FC<Props> = ({ statement }) => {
	return (
		<div>
			<div className="wrapper">
				<InfoParser statement={statement} />
			</div>
		</div>
	);
};

export default Info;
