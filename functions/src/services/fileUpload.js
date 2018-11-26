"use strict";
var bodyParser = require("body-parser");
var Busboy = require("busboy");
var getRawBody = require("raw-body");
var contentType = require("content-type");
module.exports = function (path, api) {
    api.use(bodyParser.json());
    api.use(bodyParser.urlencoded({
        extended: true
    }));
    api.use(function (req, res, next) {
        console.log('first api: ', req);
        if (req.rawBody === undefined && req.method === "POST" && req.headers["content-type"].startsWith("multipart/form-data")) {
            getRawBody(req, {
                length: req.headers["content-length"],
                limit: "10mb",
                encoding: contentType.parse(req).parameters.charset
            }, function (err, string) {
                if (err)
                    return next(err);
                req.rawBody = string;
                return next();
            });
        }
        else {
            return next();
        }
    });
    api.use(function (req, res, next) {
        console.log('second api: ', req);
        if (req.method === "POST" && req.headers["content-type"].startsWith("multipart/form-data")) {
            var busboy = new Busboy({
                headers: req.headers
            });
            var fileBuffer_1 = new Buffer("");
            req.files = {
                file: []
            };
            busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
                file.on("data", function (data) {
                    fileBuffer_1 = Buffer.concat([fileBuffer_1, data]);
                });
                file.on("end", function () {
                    var file_object = {
                        fieldname: fieldname,
                        originalname: filename,
                        encoding: encoding,
                        mimetype: mimetype,
                        buffer: fileBuffer_1
                    };
                    req.files.file.push(file_object);
                    next();
                });
            });
            busboy.end(req.rawBody);
        }
        else {
            return next();
        }
    });
};
