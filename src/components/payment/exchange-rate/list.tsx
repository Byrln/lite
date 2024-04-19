import { format } from "date-fns";
import { Button } from "@mui/material";
import { useContext } from "react";

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
    const { data, error } = ExchangeRateSWR();
    const { handleModal }: any = useContext(ModalContext);

    const columns = [
        {
            title: "Өдөр",
            key: "BeginDate",
            dataIndex: "BeginDate",
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
            title: "Улс",
            key: "CountryName",
            dataIndex: "CountryName",
        },
        {
            title: "Ханш",
            key: "CurrencyName",
            dataIndex: "CurrencyName",
        },
        {
            title: "Код",
            key: "CurrencyCode",
            dataIndex: "CurrencyCode",
        },
        {
            title: "Тэмдэгт",
            key: "CurrencySymbol",
            dataIndex: "CurrencySymbol",
        },
        {
            title: "Худ.Авах",
            key: "CurrencyID",
            dataIndex: "CurrencyID",
        },
        {
            title: "Зарах",
            key: "CountryID",
            dataIndex: "CountryID",
        },
        {
            title: "Үндсэн",
            key: "Main",
            dataIndex: "Main",
        },
        {
            title: "Хэрэглэгчийн нэр",
            key: "UserName",
            dataIndex: "UserName",
        },
        {
            title: "Нэмэлт үйлдэл",
            key: "Action",
            dataIndex: "Action",
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
