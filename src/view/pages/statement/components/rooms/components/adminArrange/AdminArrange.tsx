import { FC } from "react";

// Custom components


// Redux


// Third party libraries
import {  Statement } from "delib-npm";

// Statements functions


import "./AdminArrange.scss";

interface Props {
    statement: Statement;
   
}

const AdminSeeAllGroups: FC<Props> = ({ statement }) => {
	

	return (
		<div className="admin-arrange">
			{statement.statement}
		</div>
	);
};

export default AdminSeeAllGroups;
