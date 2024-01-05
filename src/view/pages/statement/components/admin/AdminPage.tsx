import { Evaluation, Vote } from "delib-npm";
import { StatementSettings } from "./settings/StatementSettings";
import { handleGetEvaluators } from "./AdminPageCont";
import { useParams } from "react-router-dom";
import { useState } from "react";

import styles from "./AdminPage.module.scss";
import Chip from "../../../../components/chip/Chip";

const AdminPage = () => {
    const { statementId } = useParams<{ statementId: string }>();
    const [evaluators, setEvaluators] = useState<Evaluation[]>([]);

    return <StatementSettings />;
};

export default AdminPage;
