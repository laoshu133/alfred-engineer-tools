/**
 * utils
 */

import crypto from 'crypto';

const utils = {
    encodeURI(data = '') {
        return encodeURIComponent(data || '');
    },
    decodeURI(str = '') {
        try {
            return decodeURIComponent(str || '');
        }
        catch(err) {
            return str || '';
        }
    },
    encodeBase64(data = '') {
        return Buffer.from(data).toString('base64');
    },
    decodeBase64(str = '') {
        try {
            // Add removed at end '='
            str += Array(5 - str.length % 4).join('=');

            str = str
                // Convert '-' to '+'
                .replace(/\-/g, '+')
                // Convert '_' to '/'
                .replace(/\_/g, '/');

            return Buffer.from(str, 'base64');
        }
        catch(err) {
            return null;
        }
    },
    base64ToURLSafe(str = '') {
        return str
            .replace(/\+/g, '-') // Convert '+' to '-'
            .replace(/\//g, '_') // Convert '/' to '_'
            .replace(/=+$/, ''); // Remove ending '='
    },

    // Hash
    hash(data = '', method = 'md5') {
        if(Array.isArray(data)) {
            data = Buffer.from(data);
        }
        else if (typeof data === 'string') {
            data = Buffer.from(data, 'utf8');
        }

        return crypto.createHash(method)
            .update(data)
            .digest('hex');
    },
    md5(data = '') {
        return this.hash(data, 'md5');
    },
    sha1(data = '') {
        return this.hash(data, 'sha1');
    }
};

export default utils;
