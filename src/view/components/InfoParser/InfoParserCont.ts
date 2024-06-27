export function getTopSections(text: string): string[]{
    try {
        const sections = text.split('#');
        return sections;
    } catch (error) {
        console.error(error);  
        return [];
    }
 
}