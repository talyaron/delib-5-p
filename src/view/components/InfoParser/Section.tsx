import { FC } from "react";
import { Sections, switchLevelToMarkdown } from "./InfoParserCont";

interface Props{
  section: Sections;
}

export const Section: FC<Props> = ({section}) => {
  
  const {level, title, paragraphs, sections} = section;
 console.log("level", level)
 console.log("title", title)
  console.log("paragraphs", paragraphs)
  console.log("sections", sections)

  return (
    <section>
      {switchHeaders(title, level)}
      {paragraphs.map((paragraph, index) => (
        <p key={`p-${level}-${index}`}>{paragraph}</p>
      ))}
      {sections.map((section, index) => (
        <Section
          key={`section-${index}-${level}`}
          section={section}
        />
      ))}
    </section>
  );
};

function switchHeaders(text: string, level: number) {
 
  const markdown = `${switchLevelToMarkdown(level)} `;
  text = text.substring(markdown.length-1);
 
 
  switch (level) {
    case 1:
      return <h1>{text}</h1>;
    case 2:
      return <h2>{text} </h2>;
    case 3:
      return <h3>{text} </h3>;
    case 4:
      return <h4>{text} </h4>;
    case 5:
      return <h5>{text} </h5>;
    case 6:
      return <h6>{text} </h6>;
    default:
      return <p>{text} </p>;
  }
}
