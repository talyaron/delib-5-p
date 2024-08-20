import { FC } from "react";
import styles from "./Text.module.scss";

interface Props {
  statement?: string;
  description?: string;
}
const Text: FC<Props> = ({ statement, description }) => {
	try {
		if (!statement && !description) throw new Error("No text provided");

		const textId = `${Math.random()}`.replace(".", "");

		//convert sentences, divided by /n to paragraphs
		const paragraphs = !description
			? ""
			: description
				.split("\n")
				.filter((p) => p)
				.map((paragraph: string, i: number) => {
            

					//if paragraph has * at some point and has some * at some other point make the string between the * bold
					if (paragraph.includes("*")) {
						const boldedParagraph = paragraph.split("*").map((p, i) => {
							if (i % 2 === 1) return <b key={`${textId}--${i}`}>{p}</b>;

							return p;
						});

						return (
							<p className={`${styles["p--bold"]} ${styles.p}`} key={`${textId}--${i}`}>
								{boldedParagraph}
							</p>
						);
					}

					return (
						<p className={styles.p} key={`${textId}--${i}`}>
							{paragraph}
						</p>
					);
				});

		return (
			<>
				{statement && <p className={styles.title}>{statement}</p>}
				{paragraphs.length > 0 && (
					<div className={styles.text}>{paragraphs}</div>
				)}
			</>
		);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		console.error(error);

		return <p>error: {error.message}</p>;
	}
};

export default Text;
