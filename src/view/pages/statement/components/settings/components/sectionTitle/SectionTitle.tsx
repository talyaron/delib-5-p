import { FC } from 'react';
import LightCogIcon from '@/assets/icons/lightCogIcon.svg?react';
import './SectionTitle.scss';
import { useLanguage } from '@/controllers/hooks/useLanguages';

interface SectionTitleProps {
	title: string;
}

const SectionTitle: FC<SectionTitleProps> = ({ title }) => {
	const { dir } = useLanguage();

	return (
		<h2 className={`section-title ${dir}`}>
			{title} <LightCogIcon />
		</h2>
	);
};

export default SectionTitle;
