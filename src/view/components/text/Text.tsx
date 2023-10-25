import { FC } from 'react'

interface Props {
    text: string;
    onlyTitle?: boolean;
}
const Text: FC<Props> = ({ text, onlyTitle }) => {

    const textId = `${Math.random()}`.replace('.', '')
    //convert sentences, devided by /n to paragraphs
    const paragraphs = text.split('\n').filter(p => p).map((paragraph: string, i: number) => {
       
        if (paragraph.startsWith('*')) return <span key={`${textId}--${i}`}><b>{paragraph.replace('*', '')}</b></span>

        //if paragraph has * at some point and has some * at some other point make the string between the * bold
        if (paragraph.includes('*')) {

            const boldedParagraph = paragraph.split('*').map((p, i) => {
                if (i % 2 === 1) return <b key={`${textId}--${i}`}>{p}</b>
                return p
            })

            return <p key={`${textId}--${i}`}>{boldedParagraph}</p>
        }

        return <p key={`${textId}--${i}`}>{paragraph}</p>
    })

    if(onlyTitle) return (<span>{paragraphs[0]}</span>)
    return (
        <span>{paragraphs}</span>
    )
}

export default Text