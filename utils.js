/**
 * utils
 */

import dns from 'dns';
import net from 'net';
import alfy from 'alfy';
import crypto from 'crypto';
import { exec } from 'child-process-promise';

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
    },

    // IP
    isURL(url = '') {
        const rURL = /^\w+:\/\/\w+/;

        return rURL.test(url);
    },
    urlToDomain(url = '') {
        return url.replace(/^\w+:\/\//, '');
    },
    async lookup(domain = '') {
        const promise = new Promise((resolve, reject) => {
            domain = this.urlToDomain(domain);

            dns.lookup(domain, (err, addr) => {
                if(err) {
                    reject(err);
                    return;
                }

                resolve(addr);
            });
        });

        return promise;
    },
    async getLocalIP(family = 4) {
        const ipv4Cmd = `ifconfig | grep 'inet.*broadcast' -m 1 | awk '{print $2}'`;
        const ipv6Cmd = `ifconfig | grep 'inet6.*%en' -m 1 | awk '{print $2}' | sed 's/%en*//'`;

        const res = await exec(family === 6 ? ipv6Cmd : ipv4Cmd);

        return String(res.stdout || '').trim() || 'n/a';
    },
    async getExternalIP(family = 4) {
        const ipInfo = await this.getIpInfoByCIP('');

        // TODO: 支持 External IPv6
        // if(family === 6) {}

        return ipInfo.ip;
    },
    async getIpInfoByCIP(ip = '') {
        const ipInfos = { ip };

        const keysMap = {
            'IP': 'ip',
            '地址': 'addr',
            '运营商': 'isp'
        };

        const text = await alfy.fetch('https://cip.cc/' + ip, {
            headers: {
                'User-Agent': 'curl/7.87.0'
            },
            json: false,
            transform(res) {
                return String(res || '').trim();
            }
        });

        text.replace(/^([^:]+):(.+)$/mg, (a, key, val) => {
            key = String(key || '').trim();
            val = String(val || '').trim();

            key = keysMap[key] || key;

            if(!key || !val) {
                return;
            }

            // 地区
            if(key === 'addr') {
                const addrInfo = val.split(/\s+/);

                ipInfos.country = addrInfo[0];
                ipInfos.region = addrInfo[1];
                ipInfos.city = addrInfo[2];
            }
            else {
                ipInfos[key] = val;
            }
        });

        return ipInfos;
    },
    async getIpInfo(ip = '') {
        return await alfy.fetch('https://ipinfo.io/' + ip, {
            headers: {
                'User-Agent': 'curl/7.87.0'
            }
        });
    },
    async ipInfo(ip = '') {
        ip = String(ip || '').trim();

        // 可能为域名
        if(ip && !net.isIP(ip)) {
            try {
                ip = await this.lookup(ip);
            }
            catch(err) {}
        }

        if(!ip || !net.isIP(ip)) {
            throw new Error('Not a valid IP');
        }

        // 优先尝试使用 CIP
        try {
            return this.getIpInfoByCIP(ip);
        }
        catch(err) {}

        return this.getIpInfo(ip);
    }
};

export default utils;
