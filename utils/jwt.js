var crypto = require('crypto');

exports.encode = function (payload, secret) {
    algorithm = 'HS256';

    var header = {
        typ: 'JWT',
        alg: algorithm
    };

    var jwt = base64Encode(JSON.stringify(header)) + '.' + base64Encode(JSON.stringify(payload));
    return jwt + '.' + sign(jwt, secret);
}

exports.decode = function (token, secret) {
    var segements = token.split('.');
    if (segements.length !== 3) {
        // throw new Error('Token structure incorrect');
        return null;
    }

    var headerSeg = segements[0];
    var payloadSeg = segements[1];
    var signature = segements[2];

    var payload = JSON.parse(base64Decode(payloadSeg));

    if (!verify([headerSeg, payloadSeg].join('.'), secret, signature)) {
        // throw new Error('Signature verification failed');
        return null;
    }

    if (payload.nbf && Date.now() < payload.nbf * 1000) {
        // throw new Error('Token not yet active');
        return null;
    }

    if (payload.exp && Date.now() > payload.exp * 1000) {
        // throw new Error('Token expired')
        return null;
    }

    return JSON.parse(base64Decode(payloadSeg));
}

function sign(str, key) {
    return crypto.createHmac('sha256', key)
        .update(str).digest('base64');
}

function base64Encode(str) {
    return new Buffer(str).toString('base64');
}

function base64Decode(str) {
    return new Buffer(str, 'base64').toString();
}

function verify(input, key, signature) {
    return signature === sign(input, key);
}