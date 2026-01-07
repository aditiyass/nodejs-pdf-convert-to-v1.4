//app.js

const express = require('express');
const app = express();
const path = require('path');
const fileUpload = require('express-fileupload');
const exec = require('child_process').exec;
const tmp = require('temporary');
const session = require('express-session');

const PORT = 3000;

// pengaturan session
app.use(session({
    secret: "3829a56c99d66e0174f48ba749640e43d3045a9dc6ef9d14519aa687e3e0d3f1",
    resave: true,
    saveUninitialized: true,
    cookie: {
        sameSite: 'strict',
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    }
}));

// aktifkan upload file
app.use(fileUpload({
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// tampilkan tampilan utama
app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    // res.status(200).send("<h1>Hello GFG Learner!</h1>");
    res.sendFile(path.join(__dirname, '/html/convert.html'));
});

// pakai folder public
app.use(express.static('public'))

// upload file pdf
app.post('/', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            })
        }
        else {
            let originalpdfdata = req.files.pdffilename;
            let originalname = req.files.pdffilename.name;
            let newfile = new tmp.File();
            let datacommand = 'gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dNOPAUSE -dQUIET -dBATCH -sOutputFile=' + newfile.path + ' ' + originalpdfdata.tempFilePath;
            exec(datacommand, (error, stdout, stderr) => {
                if (!error) {
                    res.download(newfile.path, "pdf v1.4 - " + originalname);
                    newfile.unlink;
                }
                else {
                    res.send({
                        status: false,
                        message: 'Invalid'
                    })
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

//jalankan aplikasi
app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT);
    else
        console.log("Error occurred, server can't start", error);
}
);