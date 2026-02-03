// Edit 02
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'my_super_secret_key';

function authorize(allowedRoles = []) {
  return (req, res, next) => {

    let token = null;

    // อ่านจาก Cookie (กรณีเรียกจากหน้าเว็บ)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // อ่านจาก Authorization Header (Postman / API)
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }
    console.log("test token01");
    console.log(token);
    // ยังไม่มี token
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      console.log(allowedRoles);
      // เช็ค role
      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(decoded.role)
      ) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // check path ว่าไปไหนต่อ
      // console.log(req.method, req.originalUrl);
    
      req.user = decoded;
      console.log("decoded user:", decoded);

      next();

      console.log("decoded:", decoded);

    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}

module.exports = authorize;
