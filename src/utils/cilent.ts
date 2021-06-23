// utils/cilent.ts

import http, { RequestOptions, IncomingMessage } from 'http';
import https, { RequestOptions as HttpsRequestOptions } from 'https'

export default function httpsRequest(options: HttpsRequestOptions, postData?: any) {
    return new Promise(function (resolve, reject) {
        var req = https.request(options, function (res: IncomingMessage) {

            if (res.statusCode !== 200) {
                return reject(res.statusCode);
            }

            var body: any = [];
            res.on('data', function (chunk) {
                body.push(chunk);
            });

            res.on('end', function () {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch (e) {
                    reject(e);
                }
                resolve(body);

            });

            req.on('error', function (err) {
                reject(err);
            });

            if (postData) {
                req.write(postData);
            }
        });
        req.end();
    });
}

export function httpRequest(options: RequestOptions, postData?: any) {
    return new Promise(function (resolve, reject) {
        var req = http.request(options, function (res: IncomingMessage) {

            if (res.statusCode !== 200) {
                return reject(new Error('statusCode=' + res.statusCode));
            }

            var body: any = [];
            res.on('data', function (chunk) {
                body.push(chunk);
            });

            res.on('end', function () {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch (e) {
                    reject(e);
                }
                resolve(body);

            });

            req.on('error', function (err) {
                reject(err);
            });

            if (postData) {
                req.write(postData);
            }
        });
        req.end();
    });
}