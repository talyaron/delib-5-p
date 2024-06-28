export function getTextArrays(text: string, level: number): { title: string, paragraphs: string[], sectionsString: string[] } {
    try {

        const title = getTitle(text);
        const paragraphs = getParagraphs(text, level);
        const sectionsString = getSectionsString(text, level);


        return { title, paragraphs, sectionsString };
    } catch (error) {
        console.error(error);
        return { title: "", paragraphs: [], sectionsString: [] };
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
        // if(level === 3) debugger;
        let texts = text.split('\n');
   
        //is there another section?
        const nextSectionIndex = texts.findIndex((text) => text.startsWith("#"));
        if (nextSectionIndex > 0) {
           texts= texts.splice(1,nextSectionIndex);
        } else {
            texts.splice(0,1);
        }
        const paragraphs = texts.filter((p) => p.length > 0);
        return paragraphs;
        return texts;
    } catch (error) {
        console.error(error);
        return [];
    }
}

function getSectionsString(text: string, level: number): string[] {
    try {

        const markdownLevel = switchLevelToMarkdown(level);


        const markdnRegExp = new RegExp(`\n${markdownLevel} `, 'g');

        const _texts = text.split(markdnRegExp).map((t) => `${markdownLevel} ${t}`);


        const texts = _texts.splice(1)


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

export function getSectionObj(text: string, level: number): Sections | undefined {
    try {

        const { title, paragraphs, sectionsString } = getLevelTexts(text, level)
        const sections: Sections[] = sectionsString.map(sct => getSectionObj(sct, level) as Sections);
        return { level, title, paragraphs, sections, sectionsString};

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
    
        return { level, title, paragraphs, sectionsString};
    } catch (error) {
        console.error(error);
        return { level, title: "", paragraphs: [], sectionsString: [] };
    }
}


