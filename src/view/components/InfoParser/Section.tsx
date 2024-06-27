import { FC } from "react";
import { getTextArrays } from "./InfoParserCont";
import { switchHeaders } from "./InfoParser";
interface Props {
  sectionText: string;
  parentLevel: number;
}

export const Section: FC<Props> = ({ sectionText, parentLevel }) => {
  console.log("sectionText", sectionText);
  const level = parentLevel + 1;
  console.log("level", level);
  const { title, paragraphs, sectionsString } = getTextArrays(
    sectionText,
    level
  );

  console.log("paragraphs", paragraphs);
    console.log("sectionsString", sectionsString);

  return (
    <section>
      {switchHeaders(`${level}) ${title}`, level)}
      {paragraphs.map((paragraph, index) => (
        <p key={`p-${level}-${index}`}>{paragraph}</p>
      ))}
      {sectionsString.map((sectionString, index) => (
        <Section
          key={`section-${index}`}
          sectionText={sectionString}
          parentLevel={level}
        />
      ))}
    </section>
  );
};
