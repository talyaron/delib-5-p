import { Statement } from "delib-npm";
import { FC } from "react";
import { getTitle, getTopSections } from "./InfoParserCont";
import { Section } from "./Section";

interface Props {
  statement: Statement;
}

const InfoParser: FC<Props> = ({ statement }) => {
  const { title,sectionsString } = getTitle(statement.statement);
  const sections = getTopSections(sectionsString);
  console.log(sections);
  return (
    <>
      <h1>{title}</h1>
      {sections.map((section, index) => (
        <Section key={`section-${index}`} sectionText={section} />
      ))}
    </>
  );
};

export default InfoParser;
