import { Role, StatementSubscription } from "delib-npm"
import { FC } from "react"
import styles from "./membership.module.scss"

interface Props {
    member: StatementSubscription
}

const MembershipLine: FC<Props> = ({ member }) => {
    return (
        <div className={styles.member}>
            <span>{member.user.displayName} </span>
            <span>{memebershipDictionarty(member.role)}</span>
        </div>
    )
}

export default MembershipLine

function memebershipDictionarty(role: Role) {
    switch (role) {
        case Role.admin:
            return "מנהל"
        case Role.member:
            return "חבר"
        case Role.banned:
            return "חסום"
        case Role.parentAdmin:
            return "מנהל על"
        case Role.guest:
            return "אורח"

        default:
            return "חבר"
    }
}
