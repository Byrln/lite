import { withRouter } from "next/router";

import GlobalStyles from "theme/global-styles";
import ThemeConfig from "theme";
import DashboardLayout from "components/layouts/dashboard";
import LogoOnlyLayout from "components/layouts/logo-only-layout";

const NonDashboardRoutes = ["/auth/login", "/_error", "/404", "/500"];

const Page = ({ router, children }: any) => {
    const isNotDashboard = NonDashboardRoutes.includes(router.pathname);

    return (
        <ThemeConfig>
            <GlobalStyles />
            {!isNotDashboard ? (
                <DashboardLayout>{children}</DashboardLayout>
            ) : (
                <LogoOnlyLayout>{children}</LogoOnlyLayout>
            )}
        </ThemeConfig>
    );
};

export default withRouter(Page);
