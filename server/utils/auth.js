const jwt = require('jsonwebtoken');

const key = 'eidmnsjcidkeyyu';

module.exports = {
  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    try {
      const { data } = jwt.verify(token, key, { maxAge: '2h' });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    return req;
  },
  signToken: function ({ username, email, _id }) {
    const load = { username, email, _id };

    return jwt.sign({ data: load }, key, { expiresIn: '2h' });
  },
};