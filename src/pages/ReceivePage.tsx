import React, { useEffect, useRef, useState } from "react";
import { AlertComponentProps, useAlert } from "react-alert";

import { useCrypt } from "../hooks/Crypt";
import CryptService from "../services/CryptService";

export const ReceivePage = () => {
    const alert = useAlert();
    const { publicKeyArmored, isReady } = useCrypt();

    const [message, setMessage] = useState<AlertComponentProps>();
    const [canReadClipboard, setCanReadClipboard] = useState<boolean>(true);
    const publicKeyTextAreaElement = useRef<HTMLTextAreaElement>(null);
    const [copied, setCopied] = useState<boolean>(false);
    const [input, setInput] = useState<string>("");
    const [decryptedInput, setDecryptedInput] = useState<string>("");

    useEffect(() => {
        window.onfocus = lookForMessageInClipboard;
        lookForMessageInClipboard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (input) {
            decryptInput(input);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input]);

    const lookForMessageInClipboard = async () => {
        if (decryptedInput || !canReadClipboard) {
            return;
        }

        let clipboard = "";
        try {
            clipboard = await navigator.clipboard.readText();
        } catch (_) {
            setCanReadClipboard(false);
        }

        await decryptInput(clipboard, false);
    }

    const copyPublicKeyToClipboard = (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault();

        const element = publicKeyTextAreaElement.current;
        if (element) {
            element.select();
            document.execCommand("copy");
            clearSelection();
            message?.close();
            setMessage(alert.info("Public key copied to clipboard!"));
            setCopied(true);
        }
    }

    const decryptInput = async (value: string, warnIfError: boolean = true) => {
        if (value && value.trim().match(/-----BEGIN PGP MESSAGE-----\s+/)) {
            const decrypted = await CryptService.decryptInput(value);
            if (decrypted) {
                setDecryptedInput(decrypted);
                return;
            }
        }

        if (warnIfError) {
            message?.close();
            setMessage(alert.error("Could not decrypt input. Something wrong?"));
        }
    }

    const clearSelection = () => {
        window.getSelection()?.empty && window.getSelection()?.empty();
        window.getSelection()?.removeAllRanges && window.getSelection()?.removeAllRanges();
    }

    return (
        <>
            {!isReady && (
                <span><i className="fas fa-spin fa-circle-notch mr-2" />Generating keys...</span>
            )}

            {isReady && publicKeyArmored && !decryptedInput && (
                <button className="btn btn-primary w-100" onClick={copyPublicKeyToClipboard}>
                    <i className="fas fa-clipboard mr-2" />Copy key to clipboard
                </button>
            )}

            {copied && !decryptedInput && (
                <p className="my-3 small text-muted">
                    <i className="fas fa-info-circle mr-2" />You can now publicly share your key.
                </p>
            )}

            {!decryptedInput && (
                <textarea
                    className={["form-control", "my-3", "w-100", copied ? "d-none" : ""].join(" ")}
                    ref={publicKeyTextAreaElement}
                    rows={10}
                    value={publicKeyArmored}
                    readOnly
                />
            )}

            {copied && !decryptedInput && (
                <>
                    {canReadClipboard ? (
                        <p className="font-italic my-3">
                            When you recieve the response, copy the encrypted message to your clipboard and return to this page.
                        </p>
                    ) : (
                        <textarea
                            className="form-control my-3 w-100"
                            rows={10}
                            value={input}
                            onChange={ev => setInput(ev.target.value)}
                        />
                    )}
                </>
            )}

            {decryptedInput && (
                <>
                    <span><i className="fas fa-check text-success mr-2" />Here's your message:</span>
                    <div
                        className="bg-secondary my-3 p-3 text-left text-monospace w-100"
                        style={{ whiteSpace: "pre-wrap" }}
                    >
                        {decryptedInput}
                    </div>
                </>
            )}
        </>
    );
}
