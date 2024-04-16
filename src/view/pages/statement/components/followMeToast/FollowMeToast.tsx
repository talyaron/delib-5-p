import { FC} from "react";
import { useLanguage } from "../../../../../functions/hooks/useLanguages";
import FollowMeIcon from "../../../../components/icons/FollowMeIcon";
import styles from "./FollowMeToast.module.scss";
import { Role, Statement } from "delib-npm";
import { isAdmin } from "../../../../../functions/general/helpers";
import { Link, useLocation } from "react-router-dom";
import { setFollowMeDB } from "../../../../../functions/db/statements/setStatments";
import { useAppSelector } from "../../../../../functions/hooks/reduxHooks";
import { statementSelector } from "../../../../../model/statements/statementsSlice";


interface Props {
    role: Role | undefined;
    statement: Statement | undefined;
}

const FollowMeToast: FC<Props> = ({ role, statement }) => {
    const { dir, t } = useLanguage();
    const _isAdmin = isAdmin(role);
    const {pathname} = useLocation();

    const topParentStatement = useAppSelector(statementSelector(statement?.topParentId));

   
    function handleRemoveToast() {
     
        if(!_isAdmin) return;
        if(!topParentStatement) return;
        setFollowMeDB(topParentStatement, "");
    
    }

   

    //in case the followers are in the page, turn off the follow me toast
  
    if(pathname === topParentStatement?.followMe && !_isAdmin) return null;

    //if the follow me is empty, turn off the follow me toast
    if(topParentStatement?.followMe === "" || topParentStatement?.followMe === undefined) return null;
    
    if(_isAdmin){
        return <ToastInner />
    }

    return (
        <Link to={topParentStatement?.followMe|| '/home'}>
           <ToastInner />
        </Link>
    );

    function ToastInner() {
        return (
            <div className={styles.toast} onClick={handleRemoveToast}>
                <span>
                    {t(_isAdmin ? "Follow Mode Active" : "Follow Instructor")}
                </span>
                <div
                    style={{
                        transform: `rotate(${dir === "rtl" ? "180deg" : "0deg"})`,
                    }}
                >
                    <FollowMeIcon color="white" />
                </div>
            </div>
        );
    }
};

export default FollowMeToast;
