import React, { useState, useEffect } from 'react';
import PageNotifications1 from './PageNotifications1';
import PageNotifications2 from './PageNotifications2';
import Modal from "../modal/Modal";
import { Statement } from "delib-npm";

interface Props {
    setAskNotifications: React.Dispatch<React.SetStateAction<boolean>>;
    statement: Statement | undefined;
    setShowAskPermission: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Enablenotifications({ setAskNotifications, statement, setShowAskPermission }: Props) {
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
				{currentPage === 1 && <PageNotifications1 onNext={handleNext} setAskNotifications={setAskNotifications} statement={statement} setShowAskPermission={setShowAskPermission} />}
				{currentPage === 2 && <PageNotifications2 statement={statement} setAskNotifications={setAskNotifications} setShowAskPermission={setShowAskPermission} setCurrentPage={setCurrentPage}/>}
			</div>
		</Modal>
	);
}