import React from 'react'
import IconButton from '@/view/components/iconButton/IconButton';
import PlusIcon from "@/assets/icons/plusIcon.svg?react";
import AddDocumentIcon from "@/assets/icons/document.svg?react";
import AddClusterIcon from "@/assets/icons/net-clusters.svg?react";
import AddSubGroupIcon from "@/assets/icons/team-group.svg?react";

export default function AddButton() {
	const [actionsOpen, setActionsOpen] = React.useState(false)

	const onclick = () => {
		setActionsOpen(!actionsOpen)
	}

	const addDocumentAction = () => {
		console.warn('Add document')
	}

	const addClusterAction = () => {
		console.warn('Add cluster')
	}

	const addSubGroupAction = () => {
		console.warn('Add sub group')
	}

	return (
		<div className='actions'>
			{actionsOpen && <>
				<IconButton onClick={addDocumentAction} className="action-btn">
					<AddDocumentIcon />
				</IconButton>
				<IconButton onClick={addClusterAction} className="action-btn">
					<AddClusterIcon />
				</IconButton>
				<IconButton onClick={addSubGroupAction} className="action-btn">
					<AddSubGroupIcon />
				</IconButton>
				<button className='invisibleBackground' onClick={() => setActionsOpen(false)}></button>
			</>}

			<IconButton onClick={onclick} className="plus-button">
				<PlusIcon />
			</IconButton>
		</div>
	)
}
