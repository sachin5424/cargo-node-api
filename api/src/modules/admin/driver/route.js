import { Router } from "express";
import DriverController from "./DriverController";
import WalletController from "./WalletController";
import { driverValidation, walletValidationAdmin } from "../../../validation/DriverValidations";
import { checkAdminPermission } from "../../../middleware/validateAdmin";
import { formValidation } from "../../../middleware/others";

const router = Router({ mergeParams: true });

router.get('/list/wallet-history', checkWalletListAccess, WalletController.list);
router.get('/list/wallet-history/:isAll', checkWalletListAccess, WalletController.list);
router.post('/save/wallet-history', checkWalletSaveAccess, walletValidationAdmin, formValidation, WalletController.save);

router.get('/list', checkDriverListAccess, DriverController.list);
router.get('/list/:isAll', checkDriverListAccess, DriverController.list);
router.post('/save', checkDriverSaveAccess, driverValidation, formValidation, DriverController.save);
router.delete("/delete/:id", CheckDriverDeleteAccess, DriverController.delete);


async function checkWalletListAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewWallet'); };
async function checkWalletSaveAccess (req, res, next) { checkAdminPermission(req, res, next,'addWallet'); };

async function checkDriverListAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewDriver'); };
async function checkDriverSaveAccess (req, res, next) { checkAdminPermission(req, res, next, req.body._id ? 'editDriver' : 'addDriver', true); };
async function CheckDriverDeleteAccess (req, res, next) { checkAdminPermission(req, res, next, 'deleteDriver'); };


export default router;
