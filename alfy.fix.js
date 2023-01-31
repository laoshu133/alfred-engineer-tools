import alfy from "alfy";

const logsInfo = {
    errors: [],
    logs: []
};

// alfy.log = (...args) => {
//     logsInfo.logs.push(args);
// };

// alfy.error = (...args) => {
//     logsInfo.errors.push(args);
// };

const _output = alfy.output;
const logsToText = (logs = []) => {
    return logs.map(item => {
        return JSON.stringify(item);
    })
    .join('\n\n');
};
alfy.output = (items, ...args) => {
    if(logsInfo.logs.length) {
        items.unshift({
            title: logsToText(logsInfo.logs),
            subtitle: 'Debug logs'
        });
    }

    if(logsInfo.errors.length) {
        items.unshift({
            title: logsToText(logsInfo.errors),
            subtitle: 'Debug errors'
        });
    }

    return _output.call(alfy, items, ...args);
};
