import { AlertComponentPropsWithStyle, AlertProviderProps, positions } from "react-alert";

const AlertTemplate = ({ message, options, close }: AlertComponentPropsWithStyle) => {
    const color =
        options.type === "info"
            ? "info"
            : options.type === "success"
                ? "success"
                : options.type === "error"
                    ? "danger"
                    : "";

    return (
        <aside className={`bg-${color} py-2 shadow text-center`} style={{ width: "100vw" }}>
            {message}
            <button type="button" className="close text-white mr-3" onClick={close}>
                <span aria-hidden="true">&times;</span>
            </button>
        </aside>
    );
};

const AlertOptions: AlertProviderProps = {
    template: AlertTemplate,
    timeout: 5000,
    position: positions.BOTTOM_CENTER,
    containerStyle: { zIndex: 1031 }
};

export default AlertOptions;
