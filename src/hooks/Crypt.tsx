import { useEffect, useState } from "react";
import { useAlert } from "react-alert";

import CryptService from "../services/CryptService";

export const useCrypt = () => {
    const alert = useAlert();

    const [publicKeyArmored, setPublicKeyArmored] = useState<string>();
    const [isReady, setIsReady] = useState<boolean>(false);

    useEffect(() => {
        CryptService.getKeys()
            .then(keys => {
                setPublicKeyArmored(keys.publicKeyArmored);
                setIsReady(true);
            })
            .catch(err => {
                console.error(err);
                alert.error("Could not generate key pair :(");
                setIsReady(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { publicKeyArmored, isReady };
}
