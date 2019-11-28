const moment = require('moment');
const jwt = require('jsonwebtoken');
const BaseService = require('./BaseService');
const { User } = require('../../models');
const config = require('../../config/config');

const mongoose = require('mongoose');
const db = mongoose.connection;

module.exports = class UsersService extends BaseService {
  constructor() {
    super(User);
  }

  async createToken(user, secret) {
    const { id, email, role, status } = user;

    const options = {
      expiresIn: `${config.app.tokenExpired}h`,
      audience: config.token.audience,
      issuer: config.token.issuer,
      subject: config.token.subject,
    };

    const token = await jwt.sign({ id, email, role, status }, secret, options);

    const result = {
      user: { id, email, role, status },
      token,
      tokenExpired: moment()
        .add(config.app.tokenExpired, 'hours')
        .toDate(),
    };

    return result;
  }

  async getMe(token) {
    if (token) {
      try {
        return await jwt.verify(token, process.env.TOKEN_SECRET);
      } catch (e) {
        throw new console.error('Your session expired. Sign in again.');
      }
    }
  }

  async generateSuperadmin(callback) {
    const payload = { email: 'superadmin@zoobc.net', password: 'P@ssw0rd', role: 'Superadmin', status: 'Active' };

    let user = await User.findByEmail(payload.email);

    if (!user) {
      user = await User.create(payload);

      const tokenData = await this.createToken(user, process.env.TOKEN_SECRET);

      const { token, tokenExpired } = tokenData;

      await User.findByIdAndUpdate(user.id, { token, tokenExpired }, { new: true });

      return callback(null, tokenData);
    }
    return callback(null, null);
  }

  async signIn(email, password) {
    const user = await User.findByEmail(email);

    if (!user) {
      return { success: false, message: 'No user found with this login credentials.', data: null };
    }

    const isValid = await user.validatePassword(password);

    if (!isValid) {
      return { success: false, message: 'Invalid password.', data: null };
    }

    const tokenData = await this.createToken(user, process.env.TOKEN_SECRET);

    const { token, tokenExpired } = tokenData;

    await User.findByIdAndUpdate(user.id, { token, tokenExpired }, { new: true });

    return { success: true, message: 'succesfully login.', data: tokenData };
  }

  async resetDB(token) {
    const me = await this.getMe(token);
    const { role } = me;
    const isAuthenticated = me ? true : false;
    const isSuperAdmin = role === 'Superadmin' ? true : false;

    if (isAuthenticated && isSuperAdmin) {
      try {
        const res = await db.dropDatabase();
        if (res) {
          db.close();
          return { success: true, message: 'DB succesfully dropped.', data: null };
        } else {
          return { success: false, message: 'DB failed to drop.', data: null };
        }
      } catch (error) {
        return { success: false, message: 'error when drop DB.', data: null };
      }
    }

    return {
      success: false,
      message: `You do not have authorization to reset this ${db.databaseName} database!. Please login as Superadmin first.`,
      data: null,
    };
  }
};
