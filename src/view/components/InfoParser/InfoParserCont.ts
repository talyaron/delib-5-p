export function getTitle(text: string): { sectionsString: string, title: string } {
    try {
        const texts = text.split('\n');
        const title = texts[0].replace('# ', '');
        //sections are all the text after the title
        const sectionsString = texts.slice(1).join('\n');


        return { sectionsString, title };
    } catch (error) {
        console.error(error);
        return { sectionsString: "", title: text };
    }

}

export function getTopSections(text: string): string[] {
    try {
        const sections = text.split('# ').filter((section) => section.length > 0);
        return sections;
    } catch (error) {
        console.error(error);
        return [];
    }

}