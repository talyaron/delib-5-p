import { ComponentProps, FC } from 'react';
import IconButton from '../iconButton/IconButton';
import Burger from '@/assets/icons/burgerIcon.svg?react';
import EllipsisIcon from '@/assets/icons/ellipsisIcon.svg?react';
import styles from './Menu.module.scss';
import { useLanguage } from '@/controllers/hooks/useLanguages';

interface MenuProps extends ComponentProps<'div'> {
	iconColor: string;
	isMenuOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	isHamburger?: boolean;
	children?: React.ReactNode;
}

const Menu: FC<MenuProps> = ({
	iconColor,
	isMenuOpen,
	isHamburger = false,
	setIsOpen,
	children,
}) => {
	const { dir } = useLanguage();

	if (!children) {
		return null;
	}

	return (
		<div className={styles.menu}>
			<IconButton onClick={() => setIsOpen(!isMenuOpen)}>
				{isHamburger ? (
					<Burger style={{ color: iconColor }} />
				) : (
					<EllipsisIcon style={{ color: iconColor }} />
				)}
			</IconButton>

			{isMenuOpen && (
				<div className={`${styles['menu-content']} ${dir}`}>
					{children}
					<button
						className={styles.invisibleBackground}
						onClick={() => setIsOpen(false)}
						aria-label="Close menu"
					/>
				</div>
			)}
		</div>
	);
};

export default Menu;
