import { FC, useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getIsSubscribed, listenToStatement, listenToStatementSubscription, listenToStatementsOfStatment } from '../../../functions/db/statements/getStatement';
import { useAppDispatch, useAppSelector } from '../../../functions/hooks/reduxHooks';
import { setStatement, setStatementSubscription, statementNotificationSelector, statementSelector, statementSubsSelector, statementSubscriptionSelector } from '../../../model/statements/statementsSlice';
import { Statement, StatementSubscription } from 'delib-npm';
import { Role } from '../../../model/role';
import { setStatmentSubscriptionNotificationToDB, setStatmentSubscriptionToDB, updateSubscriberForStatementSubStatements } from '../../../functions/db/statements/setStatments';
import ProfileImage from '../../components/profileImage/ProfileImage';
import { User, Screen } from 'delib-npm';
import { userSelector } from '../../../model/users/userSlice';

import { Evaluation } from '../../../model/evaluations/evaluationModel';
import { setEvaluationToStore } from '../../../model/evaluations/evaluationsSlice';
import { listenToEvaluations } from '../../../functions/db/evaluation/getEvaluation';




import StatementNav from './components/nav/StatementNav';
import StatementMain from './components/StatementMain';
import StatementOptions from './components/options/StatementOptions';
import StatementVote from './components/vote/StatementVote';

//icons
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ShareIcon from '../../icons/ShareIcon';
import ArrowBackIosIcon from '../../icons/ArrowBackIosIcon';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { SetStatementComp } from './components/set/SetStatementComp';
import StatmentRooms from './components/rooms/StatmentRooms';
import { getUserPermissionToNotifications } from '../../../functions/notifications';
import AskPermisssion from '../../components/askPermission/AskPermisssion';



let unsub: Function = () => { }
let unsubSubStatements: Function = () => { };
let unsubStatementSubscription: Function = () => { };
let unsubEvaluations: Function = () => { };


const Statement: FC = () => {

    const [talker, setTalker] = useState<User | null>(null);
    const [title, setTitle] = useState<string>('קבוצה');
    const [prevStId, setPrevStId] = useState<Statement | null | undefined>(null);
    const [showAskPermission, setShowAskPermission] = useState<boolean>(false);

    const dispatch: any = useAppDispatch();
    const navigate = useNavigate();
    const pageRef = useRef<any>(null);
    const _page = pageRef.current;
    const { statementId, page } = useParams();
    const screen: string | undefined = page;

    //check if the user is registered

    const statement = useAppSelector(statementSelector(statementId));
    const subStatements = useAppSelector(statementSubsSelector(statementId));
    const statementSubscription: StatementSubscription | undefined = useAppSelector(statementSubscriptionSelector(statementId));
    const role: any = statementSubscription?.role || Role.member;
    const user = useAppSelector(userSelector);
    const hasNotifications = useAppSelector(statementNotificationSelector(statementId));

    //store callbacks
    function updateStoreStatementCB(statement: Statement) {
        dispatch(setStatement(statement))
    }
    function updateStatementSubscriptionCB(statementSubscription: StatementSubscription) {
        dispatch(setStatementSubscription(statementSubscription))
    }

    function updateEvaluationsCB(evaluation: Evaluation) {
        dispatch(setEvaluationToStore(evaluation))
    }

    //handlers
    function handleShowTalker(_talker: User | null) {
        if (!talker) {
            setTalker(_talker);
        } else {
            setTalker(null);
        }
    }

    function handleShare() {
        const shareData = {
            title: "דליב: יוצרים הסכמות ביחד",
            text: `מוזמנים: ${statement?.statement}`,
            url: `https://delib-5.web.app/home/statement/${statementId}`,
        };
        navigator.share(shareData);
    }

    async function handleRegisterToNotifications() {
        const isPermited = await getUserPermissionToNotifications();
      
        if(!isPermited){
            setShowAskPermission(true)
            return;
        }
        setStatmentSubscriptionNotificationToDB(statement, role)
    }


    useEffect(() => {
        const page = pageRef.current;
        const animationDireaction = navigationDirection(statement, prevStId);
      
        if (animationDireaction == 'forward') {

            page.classList.add('page--anima__forwardInScreen');
            page.onanimationend = () => {
                page.classList.remove('page--anima__forwardInScreen');
            }



        } else if (animationDireaction == 'back') {
            page.classList.add('page--anima__backInScreen');

            page.onanimationend = () => {
                page.classList.remove('page--anima__backInScreen');
            }
        }
        setPrevStId(statement);
        if (statementId) {
            unsub = listenToStatement(statementId, updateStoreStatementCB);
        }

        return () => {
            unsub();

        }
    }, [statementId])

    useEffect(() => {
        if (user && statementId) {
            unsubSubStatements = listenToStatementsOfStatment(statementId, updateStoreStatementCB);
            unsubStatementSubscription = listenToStatementSubscription(statementId, updateStatementSubscriptionCB);
            unsubEvaluations = listenToEvaluations(statementId, updateEvaluationsCB)
        }

        return () => {
            unsubSubStatements();
            unsubStatementSubscription();
            unsubEvaluations();
        }
    }, [user, statementId])

    useEffect(() => { }, [statementId])

    useEffect(() => {
        if (statement) {

            const __title = statement.statement.split('\n')[0] || statement.statement;
            const _title = __title.replace('*', '');
            setTitle(_title);


            (async () => {

                const isSubscribed = await getIsSubscribed(statementId)

                // if isSubscribed is false, then subscribe
                if (!isSubscribed) {
                    // subscribe
                    setStatmentSubscriptionToDB(statement, Role.member, true)
                }
            })();


            //update subscribed field
            updateSubscriberForStatementSubStatements(statement);

        }
    }, [statement])

    function handleBack() {
  
        const page = pageRef.current;
        page.classList.add('page--anima__backOutScreen');
        page.onanimationend = () => {
            page.classList.remove('page--anima__backOutScreen');
            navigate(statement?.parentId === "top" ? '/home' : `/home/statement/${statement?.parentId}`);
        }

    }



    //JSX
    return (
        <div ref={pageRef} className='page'>
            {showAskPermission?<AskPermisssion showFn={setShowAskPermission} />:null}
            {talker ? <div onClick={() => { handleShowTalker(null) }}>
                <ProfileImage user={talker} />
            </div> : null}
            <div className="page__header">
                <div className='page__header__wrapper'>
                    <div onClick={handleBack}>
                        <ArrowBackIosIcon />
                    </div>
                    <Link to={"/home"}>
                        <HomeOutlinedIcon />
                    </Link>
                    <div onClick={handleRegisterToNotifications}>
                        {hasNotifications && Notification.permission === "granted" ? <NotificationsActiveIcon /> : <NotificationsOffIcon htmlColor='lightgray' />}
                    </div>
                    <h1>{title}</h1>
                    <div onClick={handleShare}><ShareIcon /></div>
                </div>
                {statement ? <StatementNav statement={statement} /> : null}
            </div>
            {switchScreens(screen, statement, subStatements, handleShowTalker, _page)}

        </div>
    )
}

export default Statement;

function switchScreens(screen: string | undefined, statement: Statement | undefined, subStatements: Statement[], handleShowTalker: Function, page: any) {
    try {
        if (!statement) return null;

        switch (screen) {
            case Screen.HOME:
                return <StatementMain statement={statement} subStatements={subStatements} handleShowTalker={handleShowTalker} page={page} />
            case Screen.CHAT:
                return <StatementMain statement={statement} subStatements={subStatements} handleShowTalker={handleShowTalker} page={page} />
            case Screen.OPTIONS:
                return <StatementOptions statement={statement} subStatements={subStatements} handleShowTalker={handleShowTalker} />
            case Screen.VOTE:
                return <StatementVote statement={statement} subStatements={subStatements} />
            case Screen.GROUPS:
                return <StatmentRooms statement={statement} subStatements={subStatements} />
            case Screen.SETTINGS:
                return <SetStatementComp />
            default:
                return <StatementMain statement={statement} subStatements={subStatements} handleShowTalker={handleShowTalker} page={page} />
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

function navigationDirection(currentStatement: Statement | null | undefined, prevStatement: Statement | null | undefined): 'forward' | 'back' | undefined {
    try {
        if (!prevStatement) return 'forward';
        if (!currentStatement) return undefined;
        if (currentStatement.parentId === prevStatement.statementId) return 'forward';
        if (currentStatement.statementId === prevStatement.parentId) return 'back';
        return undefined;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}