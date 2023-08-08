import ResponseUtils from '../utils/ResponseUtils.js';
import userService from '../services/user.service.js';
import FormatUtils from '../utils/FormatUtils.js';

const formatOneUser = (user, req) => {
  user = FormatUtils.imageUrl(user, 'avatar', req);
  /* user = user.toObject(); */
  if (user.password) { delete user.password; }
  return user;
}

const formatUsers = (users, req) => {
  users = users.map((x) => {
    if (x.avatar?.startsWith('/')) {
      x = FormatUtils.imageUrl(x, 'avatar', req);
    }
    if (x.password) { delete x.password; }
    return x;
  })
  /* user = user.toObject(); */
  return users;
}
export const createUser = () => async (req, res, next) => {
  try {
    const newUser = await userService.create(req.body);
    ResponseUtils.status201(
      res,
      `Create NEW user '${newUser.fullName}' successfully!`,
      formatOneUser(newUser, req)
    );
  } catch (err) { next(err); }
}

export const getUsers = (role) => async (req, res, next) => {
  try {
    let users = await userService.getListByRole(role);
    if (users && users.length > 0) {
      ResponseUtils.status200(res, 'Gets all users successfully', formatUsers(users, req));
    } else {
      ResponseUtils.status404(res, 'No users found', []);
    }
  } catch (err) { next(err); }
}
export const getUser = async (req, res, next) => {
  try {
    const { identity: _id } = req.params;
    const user = await userService.getOneById(_id, '-addresses -password');
    if (user) {
      ResponseUtils.status200(res, `Get info successfully!`, formatOneUser(user, req));
    } else {
      ResponseUtils.status404(res, `User not found!`);
    }
  } catch (err) { next(err); }
}

export const getInfo = async (req, res, next) => {
  try {
    const user = await userService.getOneById(req.user._id, '-addresses -password');
    if (user) {
      ResponseUtils.status200(res, `Get info successfully!`, user, req);
    } else {
      ResponseUtils.status404(res, `User not found!`);
    }
  } catch (err) { next(err); }
}

export const updateInfo = async (req, res, next) => {
  try {
    const userId = req.params.identity;
    const updateUser = await userService.updateBasicInfo(userId, req.body);
    if (updateUser) {
      ResponseUtils.status200(
        res,
        `Update info successfully!`,
        formatOneUser(updateUser)
      );
    } else {
      ResponseUtils.status404(res, `User '${identity}' not found!`);
    }
  } catch (err) { next(err); }
}
export const toggleHideUser = async (req, res, next) => {
  try {
    const { identity } = req.params;
    const result = await userService.toggleHideUser(identity);
    if (result) {
      ResponseUtils.status200(res, `Toggle Hide user successfully!`, result);
    } else {
      ResponseUtils.status404(res, `User not found!`);
    }
  } catch (err) { next(err); }
};

export const deleteUser = async (req, res, next) => {
  try {
    const updateUser = await userService.remove(req.user._id);
    if (updateUser) {
      ResponseUtils.status200(
        res,
        `Deleted user successfully!`,
        formatOneUser(updateUser)
      );
    } else {
      ResponseUtils.status404(res, `User '${req.user._id}' not found!`);
    }
  } catch (err) { next(err); }
}

