import { FC } from "react";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import FollowMeIcon from "../../../../components/icons/FollowMeIcon";
import { Role, Statement } from "delib-npm";
import { isAdmin } from "@/controllers/general/helpers";
import { Link, useLocation } from "react-router-dom";
import { setFollowMeDB } from "@/controllers/db/statements/setStatements";
import { useAppSelector } from "@/controllers/hooks/reduxHooks";
import { statementSelector } from "@/model/statements/statementsSlice";
import "./FollowMeToast.scss";

interface FollowMeToastProps {
    role: Role | undefined;
    statement: Statement | undefined;
}

const FollowMeToast: FC<FollowMeToastProps> = ({ role, statement }) => {
	const { dir, t } = useLanguage();
	const _isAdmin = isAdmin(role);
	const { pathname } = useLocation();

	const topParentStatement = useAppSelector(
		statementSelector(statement?.topParentId),
	);

	function handleRemoveToast() {
		if (!_isAdmin) return;
		if (!topParentStatement) return;
		setFollowMeDB(topParentStatement, "");
	}

	//in case the followers are in the page, turn off the follow me toast

	if (pathname === topParentStatement?.followMe && !_isAdmin) return null;

	//if the follow me is empty, turn off the follow me toast
	if (
		topParentStatement?.followMe === "" ||
        topParentStatement?.followMe === undefined
	)
		return null;

	if (_isAdmin) {
		return <ToastInner />;
	}

	return (
		<Link to={topParentStatement?.followMe || "/home"}>
			<ToastInner />
		</Link>
	);

	function ToastInner() {
		return (
			<button className="follow-me-toast" onClick={handleRemoveToast}>
				<span>
					{t(_isAdmin ? "Follow Mode Active" : "Follow Instructor")}
				</span>
				<div
					style={{
						transform: `rotate(${dir === "rtl" ? "180deg" : "0deg"})`,
					}}
				>
					<FollowMeIcon color="white" />
				</div>
			</button>
		);
	}
};

export default FollowMeToast;
