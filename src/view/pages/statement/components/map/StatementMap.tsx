
import { useState, FC, useEffect } from "react";

// Third party imports
import { isOptionFn, Results, Role, Statement, StatementType } from "delib-npm";

// Custom Components
import ScreenFadeIn from "@/view/components/animation/ScreenFadeIn";
import TreeChart from "./components/TreeChart";
import Modal from "@/view/components/modal/Modal";

// Helpers
import {
	FilterType,
	filterByStatementType,
	sortStatementsByHirarrchy,
} from "@/controllers/general/sorting";
import { getChildStatements } from "@/controllers/db/statements/getStatement";
import CreateStatementModal from "../createStatementModal/CreateStatementModal";

// Hooks
import { useLanguage } from "@/controllers/hooks/useLanguages";
import { useMapContext } from "@/controllers/hooks/useMap";
import { ReactFlowProvider } from "reactflow";
import { useAppDispatch, useAppSelector } from "@/controllers/hooks/reduxHooks";
import { statementSubscriptionSelector } from "@/model/statements/statementsSlice";
import { isAdmin } from "@/controllers/general/helpers";
import { listenToChildStatements } from "@/controllers/db/statements/listenToStatements";
import { Unsubscribe } from "firebase/auth";

interface Props {
	statement: Statement;
}

const StatementMap: FC<Props> = ({ statement }) => {
	const userSubscription = useAppSelector(
		statementSubscriptionSelector(statement.statementId)
	);

	const role = userSubscription ? userSubscription.role : Role.member;
	const _isAdmin = isAdmin(role);


	const { t } = useLanguage();
	const { mapContext, setMapContext } = useMapContext();

	const [results, setResults] = useState<Results | undefined>();
	const [subStatements, setSubStatements] = useState<Statement[]>([]);

	const handleFilter = (filterBy: FilterType) => {
		const filteredArray = filterByStatementType(filterBy).types;

		const filterSubStatements = subStatements.filter((state) => {
			if (!state.statementType) return false;

			return filteredArray.includes(state.statementType);
		});

		const sortedResults = sortStatementsByHirarrchy([
			statement,
			...filterSubStatements,
		]);

		setResults(sortedResults[0]);
	};

	// Get all child statements and set top result to display map
	// In the future refactor to listen to changes in sub statements
	const getSubStatements = async () => {
		const childStatements = await getChildStatements(statement.statementId);

		setSubStatements(childStatements);

		const topResult = sortStatementsByHirarrchy([
			statement,
			...childStatements.filter(
				(state) =>
					isOptionFn(state) || state.statementType === StatementType.question
			),
		])[0];

		setResults(topResult);
	};

	const dispatch = useAppDispatch();

	useEffect(() => {
		let unsubscribe: Unsubscribe | null = null;

		const fetchInitialData = async () => {
			try {
				unsubscribe = await listenToChildStatements(
					dispatch,
					statement.statementId,
					(childStatements) => {
						setSubStatements((prevStatements) => {
							return updateStatementsAndResults(prevStatements, childStatements, statement);
						});
					}
				);
			} catch (error) {
				console.error("Error fetching initial data:", error);
			}
		};

		fetchInitialData();

		return () => {
			if (unsubscribe) {
				unsubscribe();
			}
		};
	}, [statement.statementId, dispatch]);

	function updateStatementsAndResults(
		prevStatements: Statement[],
		childStatements: Statement[],
		statement: Statement,
	): Statement[] {
		const updatedStatements = [
			...prevStatements,
			...childStatements.filter(
				(stmt) => !prevStatements.some((prev) => prev.statementId === stmt.statementId)
			),
		];

		const topResult = sortStatementsByHirarrchy([
			statement,
			...updatedStatements.filter(
				(state) => isOptionFn(state) || state.statementType === StatementType.question
			),
		])[0];

		setResults(topResult);

		return updatedStatements;
	}

	const toggleModal = (show: boolean) => {
		setMapContext((prev) => ({
			...prev,
			showModal: show,
		}));
	};

	return (
		<ScreenFadeIn className="page__main">
			<ReactFlowProvider>
				<select
					aria-label="Select filter type for results"
					onChange={(ev) => handleFilter(ev.target.value as FilterType)}
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
					{results && (
						<TreeChart
							topResult={results}
							isAdmin={_isAdmin}
							getSubStatements={getSubStatements}
						/>
					)}
				</div>

				{mapContext.showModal && (
					<Modal>
						<CreateStatementModal
							allowedTypes={[StatementType.option, StatementType.question]}
							parentStatement={mapContext.parentStatement}
							isOption={mapContext.isOption}
							setShowModal={toggleModal}
							getSubStatements={getSubStatements}
						/>
					</Modal>
				)}
			</ReactFlowProvider>
		</ScreenFadeIn>
	);
};

export default StatementMap;