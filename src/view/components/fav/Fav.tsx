import { FC } from 'react'

import AddIcon from '@mui/icons-material/Add';

interface Props {
  onclick?: Function;
}
const Fav: FC<Props> = ({ onclick }) => {
  return (
    <div className="fav fav--fixed" onClick={(ev) => onclick ? onclick(ev) : null}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: 'center' }}>
        <AddIcon style={{ transform: `translateX(0rem) scale(1.45)` }} />
      </div>
    </div>
  )
}

export default Fav