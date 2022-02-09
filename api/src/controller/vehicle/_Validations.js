import { check } from '../../settings/import';
// import VehicleTypeModel from '../../data-base/models/vehicleType';

export const typeValidation = [
    check('name').notEmpty().withMessage("The 'name' field is required").isString(),
    check('icon').optional().notEmpty().withMessage("The 'icon' field is required").isString().matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Icon is not an image"),
    check('priceKM').optional().notEmpty().withMessage("The 'price per KM' field is required").isNumeric(),
    check('tripCategories').optional().notEmpty().isArray()/*. withMessage("The 'vehicle category' field is required"). */,
    // {
        // custom(async (value)=>{
        //     let count = 0;
        //     let arrPromise = []
        //     // throw new Error('YYYY')
    
        //     await value?.forEach(async (element) => {
        //             await VehicleTypeModel.findById(element) ? '' : count++;
        //     });
        //     throw new Error(count)
        //     if(count > 0){
        //         throw new Error(`${count} field${count > 0?'s are': 'is'} not valid in trip category`)
        //     }
        // }),

    // }
    check('vehicleCategory').optional().notEmpty().withMessage("The 'vehicle category' field is required"),
    check('isActive').optional().notEmpty().withMessage("The 'active' field is required").toBoolean(1 ? true : false),
    check('temp.*.value1').isArray()
];
