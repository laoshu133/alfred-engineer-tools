import alfy from 'alfy';

const inpData = String(alfy.input);
const action = process.argv[3] || 'encode';

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
    }
};

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
    }
};

// alfy.log(alfy.meta);
// alfy.log(alfy.alfred);

let items = [{
    title: `No ${action} action defeined.`
}];

if(actions[action]) {
    items = actions[action]();
}

alfy.output(items);
