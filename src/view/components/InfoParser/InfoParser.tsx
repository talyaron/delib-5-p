import { Statement } from "delib-npm";
import { FC } from "react";
import { Section } from "./Section";
import "./InfoParser.scss";
import { getSectionObj } from "./InfoParserCont";

interface Props {
  statement: Statement;
}

const InfoParser: FC<Props> = ({ statement }) => {
  const section = getSectionObj(statement.statement, 0);
  

  if (!section) return null;

  return (
    <Section
      section={section}
    />
  );

  // return <Section sectionText={statement.statement} parentLevel={0} />;
};

export default InfoParser;


