// src/services/postgres/UsersService.js
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    try {
      await this.verifyUsername(username);

      const userId = `user-${nanoid(16)}`;
      const hashedPassword = await bcrypt.hash(password, 10);

      const query = {
        text: 'INSERT INTO users (userId, username, password, fullname) VALUES($1, $2, $3, $4) RETURNING userId',
        values: [userId, username, hashedPassword, fullname],
      };

      const result = await this._pool.query(query);

      return result.rows[0].userId;
    } catch (error) {
      if (error.code === '23505') {
        throw new InvariantError('Username sudah digunakan');
      }
      throw error;
    }
  }

  async verifyUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('Username tidak tersedia');
    }
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT userId, password FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { userId, password: hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return userId;
  }
}

module.exports = UsersService;