import { Statement } from "delib-npm";
import { FC } from "react";
import { getTopSections } from "./InfoParserCont";
import { Section } from "./Section";

interface Props {
  statement: Statement;
}

const InfoParser: FC<Props> = ({ statement }) => {
  const sections = getTopSections(statement.statement);
console.log(sections)
  return (
    <>
      {sections.map((section, index) => (
        <Section key={`section-${index}`} sectionText={section} />
      ))}
    </>
  );
};

export default InfoParser;
