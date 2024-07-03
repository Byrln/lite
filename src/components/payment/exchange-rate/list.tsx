import { format } from "date-fns";
import { Button } from "@mui/material";
import { useContext } from "react";
import { useIntl } from "react-intl";
import CustomTable from "components/common/custom-table";
import {
    ExchangeRateSWR,
    ExchangeRateAPI,
    listUrl,
} from "lib/api/exchange-rate";
import NewEdit from "./new-edit";
import { ModalContext } from "lib/context/modal";
import History from "./history";

const ExchangeRateList = ({ title }: any) => {
    const intl = useIntl();
    const { data, error } = ExchangeRateSWR();
    const { handleModal }: any = useContext(ModalContext);

    const columns = [
        {
            title: intl.formatMessage({id:"TextDate"}), 
            key: "TextDate",
            dataIndex: "TextDate",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    element.row.BeginDate &&
                    format(
                        new Date(element.row.BeginDate.replace(/ /g, "T")),
                        "MM/dd/yyyy hh:mm:ss a"
                    )
                );
            },
        },
        {
            title: intl.formatMessage({id:"RowHeaderCountry"}), 
            key: "RowHeaderCountry",
            dataIndex: "RowHeaderCountry",
        },
        {
            title: intl.formatMessage({id:"RowHeaderExchangeRate"}), 
            key: "RowHeaderExchangeRate",
            dataIndex: "RowHeaderExchangeRate",
        },
        {
            title: intl.formatMessage({id:"RowHeaderCurrencyCode"}), 
            key: "RowHeaderCurrencyCode",
            dataIndex: "RowHeaderCurrencyCode",
        },
        {
            title: intl.formatMessage({id:"RowHeaderCurrencySymbol"}), 
            key: "RowHeaderCurrencySymbol",
            dataIndex: "RowHeaderCurrencySymbol",
        },
        {
            title: intl.formatMessage({id:"RowHeaderBuyRate"}), 
            key: "RowHeaderBuyRate",
            dataIndex: "RowHeaderBuyRate",
        },
        {
            title: intl.formatMessage({id:"RowHeaderSellRate"}),
            key: "RowHeaderSellRate",
            dataIndex: "RowHeaderSellRate",
        },
        {
            title: intl.formatMessage({id:"RowHeaderMain"}),
            key: "RowHeaderMain",
            dataIndex: "RowHeaderMain",
        },
        {
            title: intl.formatMessage({id:"Default_LabelUserName"}),
            key: "Default_LabelUserName",
            dataIndex: "Default_LabelUserName",
        },
        {
            title: intl.formatMessage({id:"RowHeaderAdditionalAction"}),
            key: "RowHeaderAdditionalAction",
            dataIndex: "RowHeaderAdditionalAction",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    <Button
                        key={element.id}
                        onClick={() => {
                            handleModal(
                                true,
                                `Валютын ханшын түүх`,
                                <History CurrencyID={element.row.CurrencyID} />,
                                null,
                                "large"
                            );
                        }}
                    >
                        Түүх
                    </Button>
                );
            },
        },
    ];

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={ExchangeRateAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="CurrencyID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default ExchangeRateList;
