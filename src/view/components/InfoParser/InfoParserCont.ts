export function getTextArrays(text: string, level: number): { title: string, paragraphs: string[], sections: string[] } {
    try {
        const { title, remainingString } = getTitle(text);
        console.log("remainingString", remainingString)
        const { paragraphs, sectionsString } = getParagraphs(remainingString, level);
        const markdownLevel = switchLevelToMarkdown(level);
        const sections = getSections(sectionsString, markdownLevel);
        return { title, paragraphs, sections };
    } catch (error) {
        console.error(error);
        return { title: "", paragraphs: [], sections: [] };
    }
}
export function getTitle(text: string): { remainingString: string, title: string } {
    try {
        const texts = text.split('\n');
        const title = texts[0].replace('# ', '');
        //sections are all the text after the title
        const remainingString = texts.slice(1).join('\n');


        return { remainingString, title };
    } catch (error) {
        console.error(error);
        return { remainingString: "", title: text };
    }

}

export function getParagraphs(text: string, level:number): { paragraphs: string[], sectionsString: string } {
    try {
        const markdownLevel = switchLevelToMarkdown(level);
        const _paragraphs = text.split('\n').filter((paragraph) => paragraph.length > 0);
        //get only paragraphs that are before the first time a # is found
        const paragraphs = _paragraphs.slice(0, _paragraphs.findIndex((paragraph) => paragraph.startsWith(`${markdownLevel} `)));
        const _sections = _paragraphs.slice(_paragraphs.findIndex((paragraph) => paragraph.startsWith(`${markdownLevel} `)));
        const sectionsString = _sections.join('\n');
        return { paragraphs, sectionsString };
    } catch (error) {
        console.error(error);
        return { paragraphs: [], sectionsString: text };
    }
}

export function getSections(text: string, symbol: string): string[] {
    try {
        const sections = text.split(`${symbol} `).filter((section) => section.length > 0);
        return sections;
    } catch (error) {
        console.error(error);
        return [];
    }

}

export function switchLevelToMarkdown(level: number) {
    try {
        let markdown = "";
        for (let i = 0; i < level; i++) {
            markdown += "#";
        }
        return markdown;
    } catch (error) {
        console.error(error);
        return ""
    }
}


