import { Statement } from "delib-npm";
import { FC } from "react";
import styles from "./Description.module.scss";
import Text from "@/view/components/text/Text";

interface Props {
  statement: Statement;
}

const Description: FC<Props> = ({ statement }) => {
	if (!statement.description) {
		return null;
	}
	
	return (
		<div className={styles.description}>
			<Text description={statement.description} />
		</div>
	);
};

export default Description;
