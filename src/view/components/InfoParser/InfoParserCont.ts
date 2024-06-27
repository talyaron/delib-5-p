export function getTextArrays(text: string, level: number): { title: string, paragraphs: string[], sectionsString: string[]} {
    try {
        const title = getTitle(text, level);
        const paragraphs = getParagraphs(text, level);
        const sectionsString = getSectionsString(text, level);
        
        return { title,paragraphs ,sectionsString };
    } catch (error) {
        console.error(error);
        return { title: "", paragraphs: [], sectionsString: []};
    }
}

export function getTitle(text: string, level: number): string {
    try {
        const texts = text.split('\n');
        const markdownLevel = switchLevelToMarkdown(level);
        const title = texts[0].replace(`${markdownLevel} `, '').replace("*", "");

        return title;
    } catch (error) {
        console.error(error);
        return "";
    }

}

export function getParagraphs(text: string, level: number): string[]  {
    try {
 
        const texts = text.split('\n');
        const markdownLevel = switchLevelToMarkdown(level);
        texts.splice(0,1);
        const paragraphs = texts.splice(0,texts.findIndex((text) => text.startsWith(markdownLevel))).filter((p) => p.length > 0);
        return paragraphs;
        
    } catch (error) {
        console.error(error);
        return [];
    }
}

export function getSectionsString(text: string, level:number): string[] {
    try {
        const markdownLevel = switchLevelToMarkdown(level);

        const mrkdn = new RegExp(`\n${markdownLevel} `, 'g');

        const _texts = text.split(mrkdn);
  
        const texts= _texts.splice(1)        


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


