# Engineer tools for Alfred

A engineer tools for Alfred.

## Install

```sh
npm install --global alfred-engineer-tools
```

*Requires [Node.js](https://nodejs.org) 14+ and the Alfred [Powerpack](https://www.alfredapp.com/powerpack/).*

## Usage

In Alfred, type action(eg. `encode`) and your query, then press<kbd>Enter</kbd> to copy result.

### Actions

- `encode` - Support URLEncode, base64Encode
- `decode` - Support URLDecode, base64Decode, HEX/Unicode, TypeID decoded
- `uuid` - Support UUIDv4, TypeID(UUIDv7)
- `typeid` - Encode or decode TypeID(UUIDv7)
- `hash` - Support md5, sha1
- `fs` - Format or parse bytes(filesize)
- `ip` - Lookup IP info



## CHANGELOG

## v1.5.0

- feat: feat: Add Format or parse bytes(filesize) support

## v1.4.0

- feat: Add TypeID(UUIDv7) support

## v1.3.0

- feat: Add Hex, Unicode decode support
- feat: Add hotkey trigger to decode and encode

## v1.2.1

- feat: Add uuid action support

## v1.2.0

- feat: Add ip action support

## v1.1.0

- feat: Add hash,md5,sha1 support

## v1.0.0

- feat: Add encode,decode support

## License

[MIT](https://choosealicense.com/licenses/mit/)
