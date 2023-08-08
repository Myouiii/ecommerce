import { Router } from 'express';
import { allowImageMineTypes, USER } from '../../constants.js';
import { createUser, deleteUser, getUsers, updateInfo, toggleHideUser, getUser } from '../../controllers/users.controller.js';
import { isAdmin, isAdminOrStaff } from '../../middlewares/jwt-auth.js';
import UploadUtils from '../../utils/UploadUtils.js';

const router = Router();
const upload = UploadUtils.multerUpload('/users/', allowImageMineTypes);
const roleStaff = USER.ROLE.STAFF;
const roleCustomer = USER.ROLE.CUSTOMER;

/**
 * Authorization
 * route /staff     : only admin
 * route /customer  : admin or staff
 */

//#region /staff

router.route('/staff')
  .get(isAdmin, getUsers(roleStaff))
  .post(
    isAdmin,
    upload.single('avatar'),
    UploadUtils.handleFilePath('avatar'),
    createUser(roleStaff));
//#endregion


router.route('/customer')
  .get(getUsers(roleCustomer))
  .post(
    upload.single('avatar'),
    UploadUtils.handleFilePath('avatar'),
    createUser(roleCustomer));

    
router.route('/customer/:identity')
  .get(getUsers(roleCustomer))
  .patch(
    isAdminOrStaff,
    upload.single('avatar'),
    UploadUtils.handleFilePath('avatar'),
    updateInfo
  )
  .delete(
    isAdmin,
    deleteUser
  );

router.get('/:identity', getUser);
router.patch('/:identity/toggleHide', isAdmin, toggleHideUser);



export default router;
