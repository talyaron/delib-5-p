import {FC} from 'react'
interface Props {
    sectionText: string;
}

export const Section:FC<Props> = ({sectionText}) => {
  return (
    <section>{sectionText}</section>
  )
}
