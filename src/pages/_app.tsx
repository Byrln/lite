import type { AppProps } from "next/app";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import NProgress from "nprogress";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";
import { Slide, ToastContainer } from "react-toastify";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { IntlProvider } from "react-intl";
import React, { useEffect, useContext } from "react";

import "styles/tailwind.css";
import "styles/globals.scss";
import "assets/styles.css";
import "styles/custom.css";
import { ModalProvider, ModalContext } from "lib/context/modal";
import Page from "components/layouts/page";
import WithAuth from "lib/hoc/with-auth";
import AppProvider from "lib/context/app";
import fetcher from "lib/utils/axios";
import en from "i18n/en.json";
import mon from "i18n/mon.json";
import enDashboard from "i18n/en-dashboard.json";
import monDashboard from "i18n/mon-dashboard.json";
import { useAppState } from "lib/context/app";
import NewReservation from "components/front-office/reservation-list/new";
import ShortcutsHelp from "components/common/shortcuts-help";

// Global keyboard shortcuts component
const GlobalKeyboardShortcuts = () => {
  const { handleModal }: any = useContext(ModalContext);
  const [state, dispatch]: any = useAppState();
  const [shortcutsOpen, setShortcutsOpen] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // F2 - New Reservation
      if (event.key === 'F2') {
        event.preventDefault();
        dispatch({
          type: "editId",
          editId: null,
        });
        handleModal(
          true,
          "New Reservation",
          <NewReservation workingDate={new Date()} />,
          null,
          "medium"
        );
      }

      // Alt + H - Show Shortcuts Help (case insensitive)
      if (event.altKey && (event.key === 'h' || event.key === 'H')) {
        event.preventDefault();
        setShortcutsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleModal, dispatch]);

  return (
    <ShortcutsHelp
      open={shortcutsOpen}
      onClose={() => setShortcutsOpen(false)}
    />
  );
};


export default function MyApp({ Component, pageProps }: AppProps) {
  const { locale }: any = useRouter();
  const messages: any = {
    en: { ...en, ...enDashboard },
    mon: { ...mon, ...monDashboard }
  };

  Router.events.on("routeChangeStart", () => NProgress.start());
  Router.events.on("routeChangeComplete", () => {
    NProgress.done();
    window.scrollTo(0, 0);
  });
  Router.events.on("routeChangeError", () => NProgress.done());
  return (
    // const MyApp = ({ Component, pageProps }: AppProps) => (
    <>
      <IntlProvider locale={locale} messages={messages[locale] || messages.en}>
        <Head>
          <meta
            name="viewport"
            content="user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width,height=device-height"
          />
          <meta
            name="description"
            content="Зочид буудал, Амралтын бааз, Сувилал, үйлчилгээний орон сууцад зориулсан цогц програм хангамжыг бид танд санал болгож байна."
          />
          <meta
            name="keywords"
            content="horecasoft, hotel, mongolia, Зочид буудал, Амралтын бааз, Сувилал"
          />

          <title>Horeca PMS</title>
        </Head>

        <SessionProvider session={pageProps.session}>
          <WithAuth>
            <SWRConfig
              value={{
                refreshInterval: 0,
                revalidateOnFocus: false,
                shouldRetryOnError: false,
                fetcher,
              }}
            >
              <AppProvider>
                <ModalProvider>
                  <GlobalKeyboardShortcuts />
                  <LocalizationProvider // @ts-ignore
                    dateAdapter={AdapterDateFns}
                  >

                    <Page>
                      <Component {...pageProps} />
                      <ToastContainer
                        transition={Slide}
                        newestOnTop={true}
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        closeOnClick={true}
                        pauseOnHover={true}
                        draggable={true}
                      />
                    </Page>
                  </LocalizationProvider>
                </ModalProvider>
              </AppProvider>
            </SWRConfig>
          </WithAuth>
        </SessionProvider>
      </IntlProvider>
    </>
  );
}

// export default MyApp;
