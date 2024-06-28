export function getSectionObj(text: string, level: number): Sections | undefined {
    try {
        console.log("level", level)
        console.log(text)
        const { title, paragraphs, sectionsString } = getLevelTexts(text, level + 1)
        console.log("getSectionObj - title", title)

        console.log("getSectionObj - p", paragraphs)
        console.log("getSectionObj - strSec", sectionsString)
        let sections: Sections[] = [];
        if(sectionsString.length > 0){
            sections = sectionsString.map(sct => getSectionObj(sct, level+1) as Sections);
        }
       
        return { level, title, paragraphs, sections, sectionsString };

    } catch (error) {
        console.error(error);
        return undefined;
    }

}

function getLevelTexts(text: string, level: number): { level: number, title: string, paragraphs: string[], sectionsString: string[] } {
    try {
        // if(level >=3) debugger;
        const title = getTitle(text);
        const paragraphs = getParagraphs(text, level);
        const sectionsString = getSectionsString(text, level);

        return { level, title, paragraphs, sectionsString };
    } catch (error) {
        console.error(error);
        return { level, title: "", paragraphs: [], sectionsString: [] };
    }
}


export function getTitle(text: string): string {
    try {
        const texts = text.split('\n');
        const title = texts[0]

        return title;
    } catch (error) {
        console.error(error);
        return "";
    }

}

export function getParagraphs(text: string, level: number): string[] {
    try {

        const markdown = switchLevelToMarkdown(level);
        let texts = text.split('\n');
        texts.splice(0, 1);
        const nextSectionIndex = texts.findIndex((text) => text.startsWith(markdown));

        if (nextSectionIndex !== -1) {
            texts = texts.splice(0, nextSectionIndex);
            console.log("found some paragraphs before next section", texts);

            return texts;

        } else {
            console.log("couldn't find a section, therefore returning all texts", texts);
            return texts;
        }


    } catch (error) {
        console.error(error);
        return [];
    }
}

function getSectionsString(text: string, level: number): string[] {
    try {
        const markdown = switchLevelToMarkdown(level);
        let texts = text.split(`\n${markdown} `).map((text) => `${markdown} ${text}`);
        texts.splice(0, 1);
        return texts;
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

interface Sections {
    level: number;
    title: string;
    paragraphs: string[];
    sections: Sections[];
    sectionsString?: string[];

}






