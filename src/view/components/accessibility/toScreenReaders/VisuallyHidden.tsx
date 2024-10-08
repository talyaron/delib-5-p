import { FC } from "react";

interface VisuallyHiddenProps {
  labelName: string;
}

const VisuallyHidden: FC<VisuallyHiddenProps> = ({ labelName }) => {
	return (
		<span
			style={{
				position: "absolute",
				width: "1px",
				height: "1px",
				margin: "-1px",
				padding: "0",
				overflow: "hidden",
				clip: "rect(0, 0, 0, 0)",
				border: "0",
			}}
		>
			{labelName}
		</span>
	);
};

export default VisuallyHidden;
