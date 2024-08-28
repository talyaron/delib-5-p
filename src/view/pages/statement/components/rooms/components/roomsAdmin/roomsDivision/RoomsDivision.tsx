import React from 'react'
import styles from '../RoomsAdmin.module.scss'

const RoomsDivision = () => {
  return (
    <>
    <div className={`btns ${styles.btns}`}>
        <Button
          text={t("Divide participants into rooms")}
          onClick={handleToggleEdit}
        />
      </div>
      <div className={styles.participantsPerRoom}>
        <div
          className={styles.add}
          onClick={() => handleSetParticipantsPerRoom(1)}
        >
          +
        </div>
        <input
          type="number"
          value={roomSettings?.participantsPerRoom || 7}
          onChange={(e) =>
            handleSetParticipantsPerRoomNumber(e.target.valueAsNumber)
          }
        />
        <div
          className={styles.add}
          onClick={() => handleSetParticipantsPerRoom(-1)}
        >
          -
        </div>
      </div>
    </>
  )
}

export default RoomsDivision