const { log } = require('console');
const os = require('os');

// os platform
console.log(os.platform());

// //os arch
console.log(os.arch());

// //CPU core
console.log(os.cpus());

// //os.free memory
console.log(os.freemem());

// //os.total memory
console.log(os.totalmem());

// //home dir
console.log(os.homedir());

// //uptime
console.log(os.uptime());
