import SelectWithImages from "@/view/components/selectWithImages/SelectWithImages";
import { fromDelibObjToSelectOptions } from "./newStageCont";

const NewStage = () => {
    const selectMethods = fromDelibObjToSelectOptions();    

	return (
		<div>
			<h3>New Stage</h3>
            <label htmlFor="new-stage-method">Method of deliberation</label>
			<SelectWithImages options={selectMethods} />
		</div>
	);
};

export default NewStage;
