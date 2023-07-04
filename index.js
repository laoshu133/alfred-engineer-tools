import './alfy.fix.js';
import alfy from 'alfy';
import utils from './utils.js';
import alfredNotifier from 'alfred-notifier';

const inpData = String(alfy.input || '');
const action = process.argv[3] || 'encode';
const actionExtData = process.argv[4] || '';

const actions = {
    // UUID
    uuid() {
        const uuid = utils.uuid();
        const uuidUp = uuid.replace(/-/g, '').toUpperCase();
        const typeid = utils.typeid();

        return [
            {
                title: uuid,
                subtitle: 'UUID v4',
                arg: uuid
            }, {
                title: uuidUp,
                subtitle: 'UUID v4 with upper',
                arg: uuidUp
            }, {
                title: typeid,
                subtitle: 'TypeID(UUIDv7)',
                arg: typeid
            }
        ];
    },
    // TypeID
    typeid() {
        const typeid = utils.typeid(inpData);

        return [
            {
                title: typeid,
                subtitle: 'TypeID(UUIDv7)',
                arg: typeid
            }
        ];
    },

    // Codec
    encode() {
        const base64 = utils.encodeBase64(inpData);
        const safeBase64 = utils.base64ToURLSafe(base64);
        const urlEnocded = utils.encodeURI(inpData);

        return [
            {
                title: urlEnocded,
                subtitle: 'URL encoded',
                arg: urlEnocded
            }, {
                title: base64,
                subtitle: 'base64 encoded',
                arg: base64
            }, {
                title: safeBase64,
                subtitle: 'base64(urlsafe) encoded',
                arg: safeBase64
            }
        ];
    },
    decode() {
        const urlDeocded = utils.decodeURI(inpData);
        const items = [
            {
                title: urlDeocded,
                subtitle: 'URL decoded',
                arg: urlDeocded
            }
        ];

        // Hex, Unicode: \x4A\x{61}\u7a7a\u{6c14}
        const rHex = /\\([xu]){?([A-F0-9]{2,4})}?/ig;
        const hexDeStr = inpData.replace(rHex, (a, r, n) => {
            const hex = n.padStart(r === 'u' ? 4 : 2, '0');
            const point = parseInt(hex, 16) || 0;

            return point > 0 ? String.fromCodePoint(point) : a;
        });

        if(hexDeStr !== inpData) {
            items.unshift({
                title: hexDeStr,
                subtitle: 'HEX/Unicode decoded',
                arg: hexDeStr
            });
        }

        const base64Decoded = utils.decodeBase64(inpData);
        if(base64Decoded) {
            const base64Str = base64Decoded.toString();

            items.push({
                title: base64Str,
                subtitle: 'Base64 decoded',
                arg: base64Str
            });
        }

        const typeidDecoded = utils.decodeTypeID(inpData);
        if (typeidDecoded) {
            items.push({
                title: typeidDecoded,
                subtitle: 'TypeID decoded',
                arg: typeidDecoded
            });
        }

        return items;
    },

    // Hash
    md5() {
        const md5Hash = utils.md5(inpData);

        return {
            title: md5Hash,
            subtitle: 'md5',
            arg: md5Hash
        };
    },
    sha1() {
        const sha1Hash = utils.sha1(inpData);

        return {
            title: sha1Hash,
            subtitle: 'sha1',
            arg: sha1Hash
        };
    },
    hash() {
        return [
            this.md5(),
            this.sha1()
        ];
    },

    // IP
    async localIP() {
        const subtitle = 'Press enter to copy, ⌘Enter to get ip info';
        const localIP = await utils.getLocalIP();
        const localIPv6 = await utils.getLocalIP(6);
        const externalIP = await utils.getExternalIP();

        const items = [
            {
                title: `Local IP: ${localIP}`,
                arg: localIP,
                subtitle
            }, {
                title: `External IP: ${externalIP}`,
                arg: externalIP,
                subtitle
            }
        ];

        if(localIPv6) {
            items.push({
                title: `Local IPv6: ${localIPv6}`,
                arg: localIPv6,
                subtitle
            });
        }

        return items;
    },
    async ipInfo(ip = inpData) {
        const ipInfo = await utils.ipInfo(ip, actionExtData);
        const items = [
            {
                title: ipInfo.ip || ip,
                subtitle: 'IP Address'
            }
        ];

        const location = [
            ipInfo.country || '',
            ipInfo.region || '',
            ipInfo.city || ''
        ].join(' ').trim();
        if(location) {
            items.push({
                title: location,
                subtitle: 'Location'
            });
        }

        if(ipInfo.isp) {
            items.push({
                title: ipInfo.isp,
                subtitle: 'ISP'
            });
        }

        if(ipInfo.hostname) {
            items.push({
                title: ipInfo.hostname,
                subtitle: 'Hostname'
            });
        }

        return items;
    },
    async ip() {
        try {
            const ip = inpData.trim();

            if(!ip) {
                return await this.localIP();
            }

            return await this.ipInfo(ip);
        }
        catch(err) {
            return {
                title: err.message,
                subtitle: 'Press enter to copy error stack',
                arg: err.stack
            };
        }
    }
};

async function main() {
    let items = [{
        title: `No ${action} action defeined.`
    }];

    if(actions[action]) {
        items = (await actions[action]()) || [];

        if(!Array.isArray(items)) {
            items = [ items ];
        }
    }

    // Debug
    // items.push({ title: JSON.stringify(alfy.meta) });
    // items.push({ title: JSON.stringify(alfy.alfred) });

    alfy.output(items);

    // Checks for available update and updates the `info.plist`
    alfredNotifier();
}

main();
