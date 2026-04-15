/* eslint-disable prettier/prettier */
const { json } = require('body-parser');
const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { hashPassword } = require('../../../utils/password');

async function getGachaHistory(request, response, next) {
  try {
    const history = await usersService.getGachaHistory();
    const hasil = [];
    for (let i = 0; i < history.length; i++) {
      hasil.push({ 'Hasil gacha': history[i].ItemWon });
    }
    return response.status(200).json(hasil);
  } catch (error) {
    return next(error);
  }
}

async function getPrizes(request, response, next) {
  try {
    const prizes = await usersService.getPrizes();

    return response.status(200).json(prizes);
  } catch (error) {
    return next(error);
  }
}

// liat history dari id
async function getHistoryId(request, response, next) {
  try {
    const history = await usersService.getHistoryId(request.params.id);
    const itemsDict = {};
    for (let i = 0; i < history.length; i++) {
      if (!(history[i].ItemWon in itemsDict)) {
        itemsDict[history[i].ItemWon] = 1;
      } else {
        itemsDict[history[i].ItemWon] += 1;
      }
    }

    return response
      .status(200)
      .json({ 'Kamu pernah menang': itemsDict, 'History gacha': history });
  } catch (error) {
    return next(error);
  }
}

async function getHistory(request, response, next) {
  try {
    const history = await usersService.getHistory();
    for (let i = 0; i < history.length; i++) {
      const arrName = history[i].fullName.split('');

      for (let j = 0; j < history[i].fullName.length / 2; j++) {
        const randomNumber = Math.floor(
          Math.random() * history[i].fullName.length
        );
        arrName[randomNumber] = '*';
      }

      history[i].fullName = arrName.join('');
    }
    return response.status(200).json(history);
  } catch (error) {
    return next(error);
  }
}

async function gacha(request, response, next) {
  try {
    const user = await usersService.getUser(request.body.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'User not found');
    }
    const today = new Date().toDateString();

    if (user.lastGachaDate !== today) {
      user.remainingQuotaUser = 5;
      user.lastGachaDate = today;
      await user.save();
    }

    if (user.remainingQuotaUser === 0) {
      return response
        .status(400)
        .json({ message: 'Quota user telah habis tunggu besok' });
    }
    await usersService.subUser(request.body.userId);
    const hasil = await usersService.gacha();
    const gachaDapetApa = Math.floor(Math.random() * 10);

    // 7/10 bisa dpet hadiah
    if (gachaDapetApa > 3) {
      const nomorRandom = Math.floor(Math.random() * hasil.length);
      await usersService.subPrize(hasil[nomorRandom]._id);
      // for display karena shownya 500 padahal udah 499
      hasil[nomorRandom].remainingQuota -= 1;
      await usersService.gachaHistory(
        user._id,
        user.fullName,
        hasil[nomorRandom].name
      );
      return response
        .status(200)
        .json({ message: `Selamat kamu dapet ${hasil[nomorRandom].name}` });
    }
    await usersService.gachaHistory(user._id, user.fullName, 'ZONK');
    return response.status(200).json({ message: 'ZONK kurang beruntung' });
  } catch (error) {
    return next(error);
  }
}

async function getUsers(request, response, next) {
  try {
    const users = await usersService.getUsers();

    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'User not found');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

async function createUser(request, response, next) {
  try {
    const {
      email,
      password,
      full_name: fullName,
      confirm_password: confirmPassword,
    } = request.body;
    const remainingQuotaUser = 5;
    const lastGachaDate = null;
    // Email is required and cannot be empty
    if (!email) {
      throw errorResponder(errorTypes.VALIDATION_ERROR, 'Email is required');
    }

    // Full name is required and cannot be empty
    if (!fullName) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'Full name is required'
      );
    }

    // Email must be unique
    if (await usersService.emailExists(email)) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email already exists'
      );
    }

    // The password is at least 8 characters long
    if (password.length < 8) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'Password must be at least 8 characters long'
      );
    }

    // The password and confirm password must match
    if (password !== confirmPassword) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'Password and confirm password do not match'
      );
    }

    // Hash the password before saving it to the database
    const hashedPassword = await hashPassword(password);

    // Create the user
    const success = await usersService.createUser(
      email,
      hashedPassword,
      fullName,
      remainingQuotaUser,
      lastGachaDate
    );

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return response.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    return next(error);
  }
}

async function updateUser(request, response, next) {
  try {
    const { email, full_name: fullName } = request.body;

    // User must exist
    const user = await usersService.getUser(request.params.id);
    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'User not found');
    }

    // Email is required and cannot be empty
    if (!email) {
      throw errorResponder(errorTypes.VALIDATION_ERROR, 'Email is required');
    }

    // Full name is required and cannot be empty
    if (!fullName) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'Full name is required'
      );
    }

    // Email must be unique, if it is changed
    if (email !== user.email && (await usersService.emailExists(email))) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email already exists'
      );
    }

    const success = await usersService.updateUser(
      request.params.id,
      email,
      fullName
    );

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    return next(error);
  }
}

async function changePassword(request, response, next) {
  // TODO: Implement this function
  // const id = request.params.id;
  // const {
  //   old_password: oldPassword,
  //   new_password: newPassword,
  //   confirm_new_password: confirmNewPassword,
  // } = request.body;
  //
  // Make sure that:
  // - the user exists by checking the user ID
  // - the old password is correct
  // - the new password is at least 8 characters long
  // - the new password is different from the old password
  // - the new password and confirm new password match
  //
  // Note that the password is hashed in the database, so you need to
  // compare the hashed password with the old password. Use the passwordMatched
  // function from src/utils/password.js to compare the old password with the
  // hashed password.
  //
  // If any of the conditions above is not met, return an error response
  // with the appropriate status code and message.
  //
  // If all conditions are met, update the user's password and return
  // a success response.
  return next(errorResponder(errorTypes.NOT_IMPLEMENTED));
}

async function deleteUser(request, response, next) {
  try {
    const success = await usersService.deleteUser(request.params.id);

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  changePassword,
  deleteUser,
  gacha,
  getHistoryId,
  getPrizes,
  getHistory,
  getGachaHistory,
};
