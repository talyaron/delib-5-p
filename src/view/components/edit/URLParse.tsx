import React from 'react';

interface UrlParserProps {
	text: string;
	className?: string;
	linkClassName?: string;
}

const UrlParser: React.FC<UrlParserProps> = ({
	text,
	className = '',
	linkClassName = '',
}) => {
	// URL regex without ^ and $ to match URLs within text
	const URL_REGEX =
		/(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/gi;

	const parseText = (text: string): React.ReactNode[] => {
		const parts: React.ReactNode[] = [];
		let lastIndex = 0;
		let match: RegExpExecArray | null;

		// Reset lastIndex to ensure we start from beginning
		URL_REGEX.lastIndex = 0;

		while ((match = URL_REGEX.exec(text)) !== null) {
			// Add the text before the URL
			if (match.index > lastIndex) {
				parts.push(
					<span key={`text-${lastIndex}`}>
						{text.slice(lastIndex, match.index)}
					</span>
				);
			}

			const url = match[0];
			const fullUrl = url.startsWith('http') ? url : `${url}`;
			const textUrl = url.replace(/^https?:\/\//, '');
			

			// Add the URL as a link
			parts.push(
				<a
					key={`link-${match.index}`}
					href={fullUrl}
					target='_blank'
					rel='noopener noreferrer'
					className={linkClassName}
				>
					{textUrl}
				</a>
			);

			lastIndex = match.index + url.length;
		}

		// Add any remaining text after the last URL
		if (lastIndex < text.length) {
			parts.push(
				<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>
			);
		}

		return parts;
	};

	return <span className={className}>{parseText(text)}</span>;
};

export default UrlParser;
