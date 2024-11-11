import { statementSubscriptionSelector } from '@/model/statements/statementsSlice';
import { Statement } from 'delib-npm';
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './setFavorite.module.scss';

//icons
import FavoriteIcon from '@/assets/icons/favorite.svg?react';
import FavoriteFullIcon from '@/assets/icons/favoriteFull.svg?react';
import { updateFavorite } from '@/controllers/db/favorite/favoriteDB';

interface Props {
	statement: Statement | undefined;
}
export const SetFavorite: FC<Props> = ({ statement }) => {
	const subscription = useSelector(
		statementSubscriptionSelector(statement?.statementId)
	);
	const [favorite, setFavorite] = useState<boolean>(
		subscription?.favorite ?? false
	);

	function handleSetFavorite() {
		setFavorite(!favorite);
		updateFavorite(statement?.statementId);
	}

	useEffect(() => {
		return setFavorite(subscription?.favorite ?? false);
	}, [subscription?.favorite]);

	return (
		<button className={styles.favorite} onClick={handleSetFavorite}>
			{favorite ? <FavoriteFullIcon /> : <FavoriteIcon />}
		</button>
	);
};
