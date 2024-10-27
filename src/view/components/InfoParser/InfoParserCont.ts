export interface Sections {
    level: number;
    title: string;
    paragraphs: string[];
    sections: Sections[];
    sectionsString?: string[];

}

export function getSectionObj(text: string, level: number): Sections | undefined {
	try {

		const nextLevel = level + 1;
		const { title, paragraphs, sectionsString } = getLevelTexts(text, nextLevel)

		let sections: Sections[] = [];
		if (sectionsString.length > 0) {
			sections = sectionsString.map(sct => getSectionObj(sct, nextLevel) as Sections);
		}

		return { level:nextLevel, title, paragraphs, sections, sectionsString };

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

		//remove * only if in the start of the lin
		const title = texts[0].replace(/^\*/, "");

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

			return texts;

		} else {

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
		const texts = text.split(`\n${markdown} `).map((text) => `${markdown} ${text}`);
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
