import { FC } from "react";
import { getTextArrays } from "./InfoParserCont";
import { switchHeaders } from "./InfoParser";
interface Props {
  sectionText: string;
  parentLevel: number;
}

export const Section: FC<Props> = ({ sectionText, parentLevel }) => {
    console.log('sectionText', sectionText)
  const level = parentLevel + 1;
  console.log('level', level)
  const { title, paragraphs, sections } = getTextArrays(sectionText, level);

  console.log({ title, paragraphs, sections });

  return (
    <section>
      {switchHeaders(title, level)}
      {paragraphs.map((paragraph, index) => (
        <p key={`p-${level}-${index}`}>{paragraph}</p>
      ))}
      {sections.map((section, index) => (
        <Section
          key={`section-${index}`}
          sectionText={section}
          parentLevel={parentLevel + 1}
        />
      ))}
    </section>
  );
};
