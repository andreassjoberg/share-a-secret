import { Link } from "react-router-dom";

export const HomePage = () => {
    return (
        <>
            <div className="row">
                <div className="col-12">
                    <Link to="/share">
                        <button className="btn btn-primary py-3 w-100">
                            <i className="fas fa-volume-up mr-2" />Share a secret with someone
                        </button>
                    </Link>
                </div>
            </div>
            <div className="row my-3">
                <div className="col-12">
                    <Link to="/receive">
                        <button className="btn btn-secondary py-3 w-100">
                            <i className="fas fa-headphones-alt mr-2" />Someone wants to share a secret with me
                        </button>
                    </Link>
                </div>
            </div>
            <div className="row my-3">
                <div className="col-12 small">
                    <p className="font-italic">
                        If you allow clipboard access, it will save you some clicks and improve the user experience.
                    </p>
                    <p>
                        <i className="fas fa-info mr-2" /> Remember that everything you do stay in your browser.
                    </p>
                </div>
            </div>
        </>
    );
}
