import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";
import Script from "next/script";

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={{ currentUser }} />
            <div className="container">
                <Component currentUser={currentUser} {...pageProps} />
                <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            </div>
        </div>
    );
};

AppComponent.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get("/api/users/currentuser");
    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(
            appContext.ctx,
            client,
            data.currentUser
        );
    }
    return {
        pageProps,
        ...data,
    };
};

export default AppComponent;
