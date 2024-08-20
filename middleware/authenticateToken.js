import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const token = req.header('auth-token');

  if (!token) {
    return res.status(401).send({ error: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Invalid token.' });
  }
};

export { authenticateToken };