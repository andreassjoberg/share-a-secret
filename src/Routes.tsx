import { Route } from "react-router"

import { HomePage } from "./pages/HomePage";
import { SharePage } from "./pages/SharePage";
import { ReceivePage } from "./pages/ReceivePage";

export const Routes = () => {
    return (
        <>
            <Route exact path="/" component={HomePage} />

            <Route path="/share" component={SharePage} />
            <Route path="/receive" component={ReceivePage} />
        </>
    );
}
