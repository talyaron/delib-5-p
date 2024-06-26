import { setInvitationToDB } from "../../../../../controllers/db/invitations/setInvitation";

interface CreateInvitationProps {
    pathname: string;
    statementId: string;
}
export function handleCreateInvitation({ pathname, statementId }: CreateInvitationProps) {
    try {
        setInvitationToDB({ pathname, statementId }).then((invitation) => {
            if (invitation) {
                console.log("Invitation created", invitation);
            } else {
                console.error("Invitation not created");
            }
        });
    } catch (error) {
        console.error(error);
    }
}