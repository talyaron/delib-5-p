import RadioButtonCheckedIcon from "../../../assets/icons/radioButtonChecked.svg?react";
import RadioButtonEmptyIcon from "../../../assets/icons/radioButtonEmpty.svg?react";
import "./radioBoxStyle.scss";

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
    const checked = currentValue === radioValue;

    return (
        <div className="radioBox" onClick={() => setCurrentValue(radioValue)}>
            {checked ? <RadioButtonCheckedIcon /> : <RadioButtonEmptyIcon />}
            <input
                type="radio"
                name="resultsBy"
                id="favoriteOption"
                checked={checked}
                value={radioValue}
                onChange={(e) => console.log(e)}
            />
            {children}
        </div>
    );
}
