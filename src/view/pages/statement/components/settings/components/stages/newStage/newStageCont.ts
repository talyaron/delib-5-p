import { SelectOption } from '@/view/components/selectWithImages/SelectWithImages';
import { deliberationMethodsModel } from '../../../../../../../../model/deliberation/deliberationMetodsModel';

export function fromDelibObjToSelectOptions():SelectOption[] {
    
    return Object.keys(deliberationMethodsModel).map((key,i) => {
        return {
            id:i,
            title: key,
            image: deliberationMethodsModel[key].defaultImage,
        };
    });
}