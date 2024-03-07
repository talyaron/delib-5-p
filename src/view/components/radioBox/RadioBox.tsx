import RadioCheckedIcon from "../icons/RadioCheckedIcon";
import RedioUncheckedIcon from "../icons/RedioUncheckedIcon";
import "./radioBoxStyle.scss"

interface Props {
    currentValue: string;
    setCurrentValue: React.Dispatch<React.SetStateAction<string>>;
    radioValue: string;
    children?: React.ReactNode;
}

export default function RadioBox({
    currentValue,
    setCurrentValue,
    radioValue,
    children,
}: Props) {
    return (
        <div className="radioBox" onClick={() => setCurrentValue(radioValue)}>
            {currentValue === radioValue ? (
                <RadioCheckedIcon />
            ) : (
                <RedioUncheckedIcon />
            )}
            <input
                type="radio"
                name="resultsBy"
                id="favoriteOption"
                checked={currentValue === radioValue}
                value={radioValue}
                onChange={(e) => console.log(e)}
            />
            {children}
        </div>
    );
}
