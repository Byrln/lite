import { useState, useContext } from "react";
import { MenuItem, Button } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { ModalContext } from "lib/context/modal";
import Invoice from "./index";
import InvoiceSummary from "./summary";

const InvoiceSelect = ({ FolioID }: any) => {
    const { handleModal }: any = useContext(ModalContext);

    const [Lang, setLang] = useState<any>("MN");
    const [invoiceType, setInvoiceType] = useState<any>("detail");
    console.log("invoiceType", invoiceType);

    const handleLanguagePick = (event: SelectChangeEvent) => {
        setLang(event.target.value as string);
    };
    const handleInvoiceTypePick = (event: SelectChangeEvent) => {
        setInvoiceType(event.target.value as string);
    };

    return (
        <>
            <Select
                value={Lang}
                onChange={handleLanguagePick}
                size="small"
                className="mr-3"
            >
                <MenuItem key={"MN"} value={"MN"}>
                    Монгол
                </MenuItem>

                <MenuItem key={"EN"} value={"EN"}>
                    Англи
                </MenuItem>
            </Select>

            <Select
                value={invoiceType}
                onChange={handleInvoiceTypePick}
                size="small"
                className="mr-3"
            >
                <MenuItem key={"summary"} value={"summary"}>
                    Хураангуй
                </MenuItem>

                <MenuItem key={"detail"} value={"detail"}>
                    Дэлгэрэнгүй
                </MenuItem>
            </Select>

            <Button
                variant={"outlined"}
                size="small"
                className="mr-3"
                // onClick={() => handleInvoice()}
                onClick={() => {
                    handleModal(
                        true,
                        "Нэхэмжлэл",
                        invoiceType == "detail" ? (
                            <Invoice FolioID={FolioID} Lang={Lang} />
                        ) : (
                            <InvoiceSummary FolioID={FolioID} Lang={Lang} />
                        ),
                        null,
                        "large"
                    );
                }}
            >
                Хэвлэх
            </Button>
        </>
    );
};

export default InvoiceSelect;
