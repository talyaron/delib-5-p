import { FC } from "react";

import { switchHeaders } from "./InfoParser";
import { Sections } from "./InfoParserCont";


export const Section: FC<Sections> = ({ title,paragraphs,sections, level }) => {
  


  return (
    <section>
      {switchHeaders(title, level)}
      {paragraphs.map((paragraph, index) => (
        <p key={`p-${level}-${index}`}>{paragraph}</p>
      ))}
      {sections.map((section, index) => (
        <Section
          key={`section-${index}-${level}`}
          title={section.title}
          level={level}
          paragraphs={section.paragraphs}
          sections={section.sections}
        />
      ))}
    </section>
  );
};
