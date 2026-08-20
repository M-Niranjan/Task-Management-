module.exports = function handler(req, res) {
  res.status(200).json({
    message: 'Backend is alive!',
    timestamp: new Date().toISOString(),
    node_version: process.version,
    env_check: {
      has_mongodb_uri: !!process.env.MONGODB_URI,
      has_jwt_secret: !!process.env.JWT_SECRET,
    }
  });
};
