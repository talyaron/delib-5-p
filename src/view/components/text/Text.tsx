import { FC } from "react";
import { z } from "zod";
import styles from "./Text.module.scss";

interface Props {
    text: string;
    onlyTitle?: boolean;
    onlyDescription?: boolean;
}
const Text: FC<Props> = ({ text, onlyTitle, onlyDescription }) => {
    try {
        if (!text) return <></>;
        z.string().parse(text);

        const textId = `${Math.random()}`.replace(".", "");

        //convert sentences, devided by /n to paragraphs
        const paragraphs = text
            .split("\n")
            .filter((p) => p)
            .map((paragraph: string, i: number) => {
                if (paragraph.startsWith("*"))
                    return (
                        <span className={styles.title} key={`${textId}--${i}`}>
                            <b>{paragraph.replace("*", "")}</b>
                        </span>
                    );

                //if paragraph has * at some point and has some * at some other point make the string between the * bold
                if (paragraph.includes("*")) {
                    const boldedParagraph = paragraph.split("*").map((p, i) => {
                        if (i % 2 === 1)
                            return <b key={`${textId}--${i}`}>{p}</b>;

                        return p;
                    });

                    return (
                        <span className={styles.title} key={`${textId}--${i}`}>
                            {boldedParagraph}
                        </span>
                    );
                }

                return (
                    <span className={styles.p} key={`${textId}--${i}`}>
                        {paragraph}
                    </span>
                );
            });

        const title = paragraphs[0];

        //description is all the paragraphs except the first one
        const description = paragraphs.slice(1);

        if (onlyTitle) return <span className={styles.title}>{title}</span>;
        else if (onlyDescription)
            return <span className={styles.p}>{description}</span>;

        return <span>{paragraphs}</span>;
    } catch (error: any) {
        console.error(error);

        return <span>error: {error.message}</span>;
    }
};

export default Text;
