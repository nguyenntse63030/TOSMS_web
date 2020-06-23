const jwt = require("jsonwebtoken");
const config = require("../../../config");

module.exports = authorize;

function authorize(roles = []) {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === "string") {
    roles = [roles];
  }

  return [
    // authenticate JWT token and attach user to request object (req.user)
    (req, res, next) => {
      const token = req.headers["python-access-token"] || req.session.token;
      if (!token) {
        return res.status(401).json({ errorMessage: "Access denied" });
      }

      try {
        const decode = jwt.verify(token, config.secret);
        req.user = decode;
        return next();
      } catch (error) {
        return res.status(400).json({ errorMessage: "Access denied" });
      }
    },

    // authorize based on user role
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        // user's role is not authorized
        return res.status(401).json({ message: "Access denied" });
      }

      // authentication and authorization successful
      return next();
    },
  ];
}
