const jwt = require('jsonwebtoken');
function verifyToken(token, next) {
if (!token) return false;
try {
 const decoded = jwt.verify(token, 'Testing134');
    if(decoded){return true}
    else{return false}
 } catch (error) {
//  res.status(401).json({ error: 'Invalid token' });
    console.log(error)
 }
 };

module.exports = verifyToken;