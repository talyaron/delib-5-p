import { useContext } from "react";
import { StatementContext } from "../../StatementCont";
import FollowMeToast from "../followMeToast/FollowMeToast";
import Header1 from "@/view/components/headers/header1/Header1";
import { useParams } from "react-router-dom";
import { Screen, Statement } from "delib-npm";
import StatementSettings from "../settings/StatementSettings";

const Switch = () => {
	const { statement } = useContext(StatementContext);
	const { page } = useParams();

	return (
		<main className="page__main">
			<FollowMeToast />
			<Header1 />
			<SwitchInner statement={statement} page={page} />
		</main>
	);
};

function SwitchInner({
	statement,
	page,
}: {
  statement: Statement | undefined;
  page: string | undefined;
}) {
	const statementType = statement?.statementType;
	if (page === Screen.SETTINGS) {
		return <StatementSettings />;
	}

	switch (statementType) {
	default:
		return <p>test</p>;
	}
}

export default Switch;
