import { check } from '../../settings/import';
import { tripCategorieModel, VehicalCategorieModel} from '../../data-base';
import VehicleTypeModel from '../../data-base/models/vehicleType';

export const typeValidation = [

    check('_id')
        .optional()
        .notEmpty().withMessage("Provide / Select a valid data")
        .custom(async (v)=>{
            try{
                const r = await VehicleTypeModel.findById(v);
                if (!r) {
                    throw new Error("Data not found");
                }
            } catch(e){
                throw new Error("This data does not exit. Please check or refresh");
            }
        }),

    check('name')
        .notEmpty().withMessage("The 'name' field is required")
        .isString().withMessage("The 'name' field is not valid"),

    check('icon')
        .notEmpty().withMessage("The 'icon' is required")
        .isString().withMessage("The 'icon' is not valid")
        .matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Icon is not an image"),

    check('priceKM')
        .notEmpty().withMessage("The 'price per KM' field is required")
        .isNumeric().withMessage("The 'price per KM' field is must be a number"),

    check('tripCategories')
        .notEmpty().withMessage("The 'vehicle category' field is required")
        .isArray().withMessage("The 'vehicle category' field must be an array")
        .custom(async (value) => {
            let count = 0;
            const arrPromise = value?.map(async (v) => {
                try {
                    const result = await tripCategorieModel.findOne({ _id: v });
                    if (!result) {
                        throw new Error("Data not found");
                    }
                } catch (e) {
                    count++;
                }
            });
            await Promise.all(arrPromise);
            if (count > 0) {
                throw new Error(`${count} field${count > 1 ? 's are' : ' is'} not valid in trip category`)
            }
        }),

    check('vehicleCategory').
        notEmpty().withMessage("The 'vehicle category' field is required")
        .custom(async (value) =>{

            try{
                const result = await VehicalCategorieModel.findById(value);
                if (!result) {
                    throw new Error("Data not found");
                }
            } catch(e){
                throw new Error("Vehicle category is not valid");
            }

        }),

    check('isActive').
        notEmpty().withMessage("The 'active' field is required")
        .toBoolean(1 ? true : false),
];