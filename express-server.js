const express = require("express");
const app = express();
const openRoutes = require('./api/api-open');
const protectedRoutes = require('./api/api-protected');
app.use(express.json());
app.use('/api/', protectedRoutes);
app.use('/api/open',openRoutes)
// Express Application Listening on.
app.listen(80,()=>{
    console.log("Port Opened is 80!!");
})