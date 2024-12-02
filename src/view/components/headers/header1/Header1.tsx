import { Statement } from "delib-npm";
import { FC, useState } from "react";
import styles from "./Header1.module.scss";
import EditTitle from "../../edit/EditTitle";

interface Props {
  statement: Statement | undefined;
}

const Header1: FC<Props> = ({ statement }) => {
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
								onlyTitle={true}
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
