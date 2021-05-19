import { useEffect, useRef, useState } from "react";
import { useAlert } from "react-alert";
import { Key } from "openpgp";

import CryptService from "../services/CryptService";

export const SharePage = () => {
    const alert = useAlert();

    const encryptedInputTextAreaElement = useRef<HTMLTextAreaElement>(null);

    const [canReadClipboard, setCanReadClipboard] = useState<boolean>(true);
    const [publicKeyInput, setPublicKeyInput] = useState<string>("");
    const [publicKey, setPublicKey] = useState<Key>();
    const [input, setInput] = useState<string>("");
    const [encryptedInput, setEncryptedInput] = useState<string>("");

    useEffect(() => {
        window.onfocus = lookForPublicKeyInClipboard;
        lookForPublicKeyInClipboard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (publicKeyInput) {
            readPublicKey(publicKeyInput);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [publicKeyInput]);

    useEffect(() => {
        copyEncryptedInputToClipboard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [encryptedInput]);

    const lookForPublicKeyInClipboard = async () => {
        if (publicKey) {
            return;
        }

        let clipboard = "";
        try {
            clipboard = await navigator.clipboard.readText();
        } catch (_) {
            setCanReadClipboard(false);
            alert.info("Please allow clipboard access for a better experience. (Everything you do stays in your browser.)");
        }

        await readPublicKey(clipboard, false);
    }

    const readPublicKey = async (input: string, warnIfError: boolean = true) => {
        if (input && input.trim().match(/-----BEGIN PGP PUBLIC KEY BLOCK-----\s+/)) {
            const key = await CryptService.readPublicKey(input);
            if (key) {
                setPublicKey(key);
                alert.info("Public key ready!")
                return;
            }
        }

        if (warnIfError) {
            alert.error("Could not read public key. Please check your input and try again.");
        }
    }

    const encryptInput = async () => {
        if (!publicKey) {
            alert.error("Key missing (how did we get here?)");
            return;
        }
        if (!input) {
            alert.info("No input to encrypt :(");
            return;
        }

        const encrypted = await CryptService.encryptInput(publicKey, input);
        if (encrypted) {
            setEncryptedInput(encrypted);
        } else {
            alert.error("Could not encrypt input. Is something wrong?");
        }
    }

    const copyEncryptedInputToClipboard = () => {
        const element = encryptedInputTextAreaElement.current;
        if (element) {
            element.select();
            document.execCommand("copy");
            alert.info("Text copied!");
        }
    }

    return (
        <>
            {!publicKey && (
                <>
                    <p className="my-3 small text-muted">
                        <i className="fas fa-info-circle mr-2" />Copy the public key of the person you wish to share a secret with.
                    </p>

                    {canReadClipboard ? (
                        <p className="font-italic my-3">
                            Return to this page with the public key copied in your clipboard.
                        </p>
                    ) : (
                        <textarea
                            className="form-control my-3 w-100"
                            rows={16}
                            value={publicKeyInput}
                            onChange={ev => setPublicKeyInput(ev.target.value)}
                        />
                    )}
                </>
            )}
            {publicKey && (
                <>
                    <p>
                        <i className="fas fa-check mr-2 text-success" />Public key ready! Type your message below and click the button to encrypt when ready.
                    </p>
                    <textarea
                        className="form-control my-3 w-100"
                        rows={10}
                        value={input}
                        onChange={ev => setInput(ev.target.value)}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={encryptInput}
                    >
                        <i className="fas fa-key mr-2" />Encrypt
                    </button>
                </>
            )}
            {encryptedInput && (
                <textarea
                    className="form-control my-3 w-100"
                    ref={encryptedInputTextAreaElement}
                    rows={10}
                    value={encryptedInput}
                    readOnly
                />
            )}
        </>
    );
}
