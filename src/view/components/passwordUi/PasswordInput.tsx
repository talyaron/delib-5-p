import { useRef, Dispatch, SetStateAction } from 'react';
import styles from "./passwordUi.module.scss"

interface PasswordProps {
    passwordLength: 4;
    values: string[],
    setValues: Dispatch<SetStateAction<string[]>>
}

const PasswordInput = ({ passwordLength: length, values, setValues }: PasswordProps) => {
    const inputs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        try {
            const val = event.target.value;
            if (/^[0-9]$/.test(val) || val === '') {
                const newValues = [...values];
                newValues[index] = val;
                setValues(newValues);
                if (val && index < length - 1) {
                    inputs.current[index + 1]?.focus();
                }
            }
        }
        catch (err) {
            console.error(err)
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (event.key === "Backspace" && !values[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    }

    return (
        <div className={styles.passwordUi__inputSection} >
            {values.map((val, index) => (
                <input
                    key={index}
                    ref={(element) => { inputs.current[index] = element }}
                    maxLength={1}
                    type="text"
                    value={val}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                    onChange={(event) => handleChange(event, index)}
                />
            ))}
        </div>
    );
};

export default PasswordInput;