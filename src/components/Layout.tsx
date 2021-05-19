import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

export const Layout = ({ children }: PropsWithChildren<{}>) => {
    return (
        <main className="container-fluid" role="main">
            <div className="row">
                <div className="col-12 col-md-6 offset-md-3 text-center">
                    <Link to="/">
                        <h1 className="text-body">Share a secret</h1>
                    </Link>
                    {children}
                </div>
            </div>
        </main>
    );
}
