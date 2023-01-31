import alfy from 'alfy';
import utils from './utils.js';

const inpData = String(alfy.input);
const action = process.argv[3] || 'encode';

const actions = {
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

        const base64Decoded = utils.decodeBase64(inpData);
        if(base64Decoded) {
            const base64Str = base64Decoded.toString();

            items.push({
                title: base64Str,
                subtitle: 'Base64 decoded',
                arg: base64Str
            });
        }

        return items;
    },
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
    }
};

// alfy.log(alfy.meta);
// alfy.log(alfy.alfred);

let items = [{
    title: `No ${action} action defeined.`
}];

if(actions[action]) {
    items = actions[action]();

    if(!Array.isArray(items)) {
        items = [ items ];
    }
}

alfy.output(items);
