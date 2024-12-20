import { Results, Role, Statement, StatementType } from "delib-npm";
import { useState, FC, useEffect } from "react";

// Third party imports

// Custom Components
import { useSelector } from "react-redux";
import { ReactFlowProvider } from "reactflow";
import CreateStatementModal from "../createStatementModal/CreateStatementModal";
import TreeChart from "./components/TreeChart";
import { isAdmin } from "@/controllers/general/helpers";
import {
	FilterType,
	filterByStatementType,
	sortStatementsByHirarrchy as sortStatementsByHierarchy,
} from "@/controllers/general/sorting";

// Helpers

// Hooks
import { useAppSelector } from "@/controllers/hooks/reduxHooks";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import { useMapContext } from "@/controllers/hooks/useMap";
import {
	statementDescendantsSelector,
	statementSubscriptionSelector,
} from "@/model/statements/statementsSlice";
import Modal from "@/view/components/modal/Modal";

interface Props {
  statement: Statement;
}

const StatementMap: FC<Props> = ({ statement }) => {
	const userSubscription = useAppSelector(
		statementSubscriptionSelector(statement.statementId)
	);
	const descendants = useSelector((state) =>
		statementDescendantsSelector(state, statement.statementId)
	);

	const role = userSubscription ? userSubscription.role : Role.member;
	const _isAdmin = isAdmin(role);

	const { t } = useLanguage();
	const { mapContext, setMapContext } = useMapContext();

	const [sortedDescendants, setSortedDescendants] = useState<Results[]>([]);
	const [filterBy, setFilterBy] = useState<FilterType>(
		FilterType.questionsResultsOptions
	);

	const handleFilter = (filterBy: FilterType, descendants: Statement[]) => {
		const _descendants = [...descendants];
		const filterArray = filterByStatementType(filterBy).types;

		const filterSubStatements = _descendants.filter((st) => {
			if (!st.deliberativeElement) return false;

			if (filterArray.includes("result") && st.isResult) return true;

			return filterArray.includes(st.deliberativeElement);
		});

		const sorted: Results[] = sortStatementsByHierarchy([
			statement,
			...filterSubStatements,
		]);

		setSortedDescendants(sorted);
	};

	useEffect(() => {
		handleFilter(filterBy, descendants);
	}, [filterBy]);

	useEffect(() => {
		handleFilter(filterBy, descendants);
	}, [descendants]);

	const toggleModal = (show: boolean) => {
		setMapContext((prev) => ({
			...prev,
			showModal: show,
		}));
	};

	return (
		<main className="page__main">
			<ReactFlowProvider>
				<select
					aria-label="Select filter type for "
					onChange={(ev) => setFilterBy(ev.target.value as FilterType)}
					defaultValue={FilterType.questionsResultsOptions}
					style={{
						width: "100vw",
						maxWidth: "300px",
						margin: "1rem auto",
						position: "absolute",
						right: "1rem",
						zIndex: 100,
					}}
				>
					<option value={FilterType.questionsResults}>
						{t("Questions and Results")}
					</option>
					<option value={FilterType.questionsResultsOptions}>
						{t("Questions, options and Results")}
					</option>
				</select>
				<div
					style={{
						flex: "auto",
						height: "20vh",
						width: "100%",
						direction: "ltr",
					}}
				>
					<TreeChart descendants={sortedDescendants} isAdmin={_isAdmin} />
				</div>

				{mapContext.showModal && (
					<Modal>
						<CreateStatementModal
							allowedTypes={[StatementType.option, StatementType.question]}
							parentStatement={mapContext.parentStatement}
							isOption={mapContext.isOption}
							setShowModal={toggleModal}
						/>
					</Modal>
				)}
			</ReactFlowProvider>
		</main>
	);
};

export default StatementMap;
