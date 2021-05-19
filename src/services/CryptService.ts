import * as openpgp from "openpgp";

const makePhrase = (length: number = 256) => {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}

const generateKeys = async () => {
    const passphrase = makePhrase(256);
    const { privateKeyArmored, publicKeyArmored } = await openpgp.generateKey({
        type: 'ecc',
        curve: 'curve25519',
        userIDs: [{ name: makePhrase(60) }],
        passphrase: passphrase
    });
    return { privateKeyArmored, publicKeyArmored, passphrase };
}

class _CryptService {
    private _privateKeyArmored: string | undefined = undefined;
    private _publicKeyArmored: string | undefined = undefined;
    private _passphrase: string | undefined = undefined;

    public getKeys = async () => {
        if (!this._privateKeyArmored || !this._publicKeyArmored) {
            const { privateKeyArmored, publicKeyArmored, passphrase } = await generateKeys();
            this._privateKeyArmored = privateKeyArmored;
            this._publicKeyArmored = publicKeyArmored;
            this._passphrase = passphrase;
        }

        return {
            publicKeyArmored: this._publicKeyArmored
        };
    }

    public readPublicKey = async (input: string) => {
        try {
            const key = await openpgp.readKey({ armoredKey: input });
            return key;
        } catch (err) {
            console.error(err);
        }
        return undefined;
    }

    public encryptInput = async (key: openpgp.Key, input: string) => {
        try {
            const encrypted = await openpgp.encrypt({
                armor: true,
                message: await openpgp.createMessage({ text: input }),
                publicKeys: key
            });
            return encrypted;
        } catch (err) {
            console.error(err);
        }
        return undefined;
    }

    public decryptInput = async (input: string) => {
        if (!this._privateKeyArmored) return undefined;

        try {
            const privateKey = await openpgp.decryptKey({
                privateKey: await openpgp.readKey({ armoredKey: this._privateKeyArmored }),
                passphrase: this._passphrase
            });
            const { data } = await openpgp.decrypt({
                message: await openpgp.readMessage({ armoredMessage: input }),
                privateKeys: privateKey
            });
            return data;
        } catch (err) {
            console.error(err);
        }
        return undefined;
    }
}

const CryptService = new _CryptService();
export default CryptService;
