import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token fehlt.' });
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'JWT-SECRET');
    req.user = decoded;

    // Rolling Session: Neues Token mit 30 Minuten Gültigkeit ausstellen
    const newToken = jwt.sign(
      {
        userId: decoded.userId,
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role
      },
      process.env.JWT_SECRET || 'JWT-SECRET',
      { expiresIn: '30m' }
    );
    res.setHeader('x-refresh-token', newToken);

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token ungültig.' });
  }
};

export default auth;
export const requireAuth = auth; 