const adminMiddleware = (req, res, next) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'pratiknerpagar2@gmail.com';
  if (req.user && (req.user.role === 'admin' || req.user.email === adminEmail)) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden. Admin access required.' });
  }
};

module.exports = adminMiddleware;
