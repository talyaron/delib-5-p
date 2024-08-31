import React, { useState, useEffect } from 'react';
import Page1 from './Page1';
import Page2 from './Page2';
import Modal from "../modal/Modal";
import { Statement } from "delib-npm";

interface Props {
  setAskNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  statement: Statement | undefined;
  setShowAskPermission: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Popup({ setAskNotifications, statement, setShowAskPermission }: Props) {
	if (!statement) throw new Error("No statement");

	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		setCurrentPage(1);
	}, []);

	const handleNext = () => {
		setCurrentPage(2);
	};

	return (
		<Modal>
			<div>
				{currentPage === 1 && <Page1 onNext={handleNext} setAskNotifications={setAskNotifications} statement={statement} setShowAskPermission={setShowAskPermission} />}
				{currentPage === 2 && <Page2 statement={statement} setCurrentPage={setCurrentPage}/>}
			</div>
		</Modal>
	);
}