const bodyParser = require("body-parser");
const Busboy = require("busboy");
const getRawBody = require("raw-body");
const contentType = require("content-type");

module.exports = (path, api) => {
    api.use(bodyParser.json());
    api.use(bodyParser.urlencoded({
        extended: true
    }));
    api.use((req, res, next) => {
        console.log('first api: ',req);
        if (req.rawBody === undefined && req.method === "POST" && req.headers["content-type"].startsWith("multipart/form-data")) {
            getRawBody(req, {
                length: req.headers["content-length"],
                limit: "10mb",
                encoding: contentType.parse(req).parameters.charset
            }, (err, string) => {
                if (err) return next(err)
                req.rawBody = string;
                return next();
            })
        } else {
            return next();
        }
    })

    api.use((req, res, next) => {
        console.log('second api: ',req)
        if (req.method === "POST" && req.headers["content-type"].startsWith("multipart/form-data")) {
            const busboy = new Busboy({
                headers: req.headers
            });
            let fileBuffer = new Buffer("");
            req.files = {
                file: []
            };

            busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
                file.on("data", (data) => {
                    fileBuffer = Buffer.concat([fileBuffer, data]);
                });

                file.on("end", () => {
                    const file_object = {
                        fieldname,
                        originalname: filename,
                        encoding,
                        mimetype,
                        buffer: fileBuffer
                    };

                    req.files.file.push(file_object);
                    next();
                });
            });

            busboy.end(req.rawBody);
        } else {
            return next();
        }
    })
}