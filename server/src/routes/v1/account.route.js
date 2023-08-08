import { Router } from 'express';
import { allowImageMineTypes } from '../../constants.js';

import {
  getInfo,
  updateInfo,
  changePassword,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} from '../../controllers/account.controller.js';


import { isAuthorized, isGuestOrAuthorized } from '../../middlewares/jwt-auth.js';
import UploadUtils from '../../utils/UploadUtils.js';

const router = Router();
const upload = UploadUtils.multerUpload('/users/', allowImageMineTypes);

router.route('/')
  .get(isAuthorized, getInfo)
  .patch(
    isAuthorized,
    upload.single('avatar'),
    UploadUtils.handleFilePath('avatar'),
    updateInfo
  );

router.route('/change-password')
  .patch(isAuthorized, changePassword);

// Start defining routes for addresses
router.route('/addresses')
  .get(isGuestOrAuthorized, getAddresses)
  .post(isAuthorized, addAddress);

router.route('/addresses/:addressId')
  .patch(isAuthorized, updateAddress)
  .delete(isAuthorized, deleteAddress);
// End defining routes for addresses



export default router;
