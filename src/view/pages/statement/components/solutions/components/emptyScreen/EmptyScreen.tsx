import { Dispatch, FC } from "react";
import styles from "../../StatementSolutionsPage.module.scss";
import useWindowDimensions from "@/controllers/hooks/useWindowDimentions";

// /graphics
import ideaImage from "@/assets/images/manWithIdeaLamp.png";
import WhitePlusIcon from "@/view/components/icons/WhitePlusIcon";
import { useLanguage } from "@/controllers/hooks/useLanguages";


interface Props {
  currentPage: string;
  setShowModal: Dispatch<boolean>;
}

const EmptyScreen: FC<Props> = ({ currentPage, setShowModal }) => {
	const {t} = useLanguage();
	const { width } = useWindowDimensions();
	const smallScreen = width < 1024;

	const handlePlusIconClick = () => {
		setShowModal(true);
	};

	return (
		<>
			<div
				className={styles.addingStatementWrapper}
				style={{ paddingTop: "2rem" }}
			>
				<div className={styles.header}>
					<div className={styles.title}>
						<h1 className={styles.h1}>
							{smallScreen ? (
								<>
									{t(`Click on`)}{" "}
									<span className={styles.titleSpan}>{t(`”+”`)}</span>{" "}
									{t(`to add your ${currentPage}`)}
								</>
							) : (
								<>
									<h1>
										{`Click on `}
										<span className={styles.titleSpan}>
											{`” ${t(`Add ${currentPage} button`)} ”`}
										</span>
										<br />
										{` to add your ${t(`${currentPage}`)}`}
									</h1>
								</>
							)}
						</h1>
					</div>
					<button
						className={styles.plusButton}
						onClick={handlePlusIconClick}
						style={smallScreen ? { width: "4rem", height: "4rem" } : {}}
					>
						{smallScreen ? (
							<WhitePlusIcon />
						) : (
							<p>
								{" "}
								{t(`Add ${currentPage}`)} <WhitePlusIcon />{" "}
							</p>
						)}
					</button>
				</div>
				<img src={ideaImage} alt="" className={styles.ideaImage} />
			</div>
      
		</>
	);
};

export default EmptyScreen;
