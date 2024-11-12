import SelectWithImages from "@/view/components/selectWithImages/SelectWithImages";
import { useState } from "react";
import { DeliberationMethod, getAllDeliberationMethods } from "@/model/deliberation/deliberationMethodsModel";

const NewStage = () => {
    const selectMethods = getAllDeliberationMethods();  
    const [selectedOption, setSelectedOption] = useState<DeliberationMethod | null>(
		null
	);  
    console.log(selectMethods)

	return (
		<div className="stage">
			<h3>New Stage</h3>
			<SelectWithImages options={selectMethods} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
            <div className="stage__description">{selectedOption?.description}</div>
		</div>
	);
};

export default NewStage;
