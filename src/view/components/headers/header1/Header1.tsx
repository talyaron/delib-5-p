import { FC, useContext, useState } from "react";
import styles from "./Header1.module.scss";
import EditTitle from "../../edit/EditTitle";
import { StatementContext } from "@/view/pages/statement/StatementCont";

const Header1: FC = () => {
	const { statement } = useContext(StatementContext);
	const [edit, setEdit] = useState(false);

	function handleSetEdit() {
		if (!edit) setEdit(true);
	}

	return (
		<div className={`wrapper ${styles.wrapper}`} >
			<button className={styles.header1} onClick={handleSetEdit}>
				{statement ? (
					<h1>
						{
							<EditTitle
								statement={statement}
								useTitle={true}
								useDescription={false}
								isEdit={edit}
								setEdit={setEdit}
							/>
						}
					</h1>
				) : (
					<h1>loading...</h1>
				)}
			</button>
		</div>
	);
};

export default Header1;
