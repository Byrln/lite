import { useState, useContext } from "react";
import { MenuItem, Button } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { ModalContext } from "lib/context/modal";
import Invoice from "./index";
import InvoiceSummary from "./summary";

const InvoiceSelect = ({ FolioID }: any) => {
    const { handleModal }: any = useContext(ModalContext);

    const [language, setLanguage] = useState<any>("mon");
    const [invoiceType, setInvoiceType] = useState<any>("detail");
    console.log("language", language);
    console.log("invoiceType", invoiceType);

    const handleLanguagePick = (event: SelectChangeEvent) => {
        setLanguage(event.target.value as string);
    };
    const handleInvoiceTypePick = (event: SelectChangeEvent) => {
        setInvoiceType(event.target.value as string);
    };

    return (
        <>
            <Select
                value={language}
                onChange={handleLanguagePick}
                size="small"
                className="mr-3"
            >
                <MenuItem key={"mon"} value={"mon"}>
                    Монгол
                </MenuItem>

                <MenuItem key={"eng"} value={"eng"}>
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
                            <Invoice FolioID={FolioID} language={language} />
                        ) : (
                            <InvoiceSummary
                                FolioID={FolioID}
                                language={language}
                            />
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
