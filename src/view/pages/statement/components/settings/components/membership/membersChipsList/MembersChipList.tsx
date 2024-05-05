import { User } from "delib-npm";
import { FC } from "react";
import UserChip from "../../../../../../../components/chip/Chip";
import "./MembersChipList.scss";

interface MembersChipsListProps {
    members: User[];
}

const MembersChipsList: FC<MembersChipsListProps> = ({ members }) => {
    return (
        <div className="members-chips-list">
            {members.map((member) => {
                return <UserChip key={member.uid} user={member} />;
            })}
        </div>
    );
};

export default MembersChipsList;
