const fs = require('fs');
const path = require('path');

class pageSender {
    constructor (path) {
        this.path = path;
    }
    send (res, fileName) {
        const filePath = path.join(this.path,'/',fileName);
        fs.access(filePath, fs.constants.R_OK, (err)=>{
            if (err) {
                res.statusCode = 404;
                res.send('error 404');
                return;
            }

            fs.createReadStream(filePath).pipe(res);
        });
    }
}

module.exports = pageSender;