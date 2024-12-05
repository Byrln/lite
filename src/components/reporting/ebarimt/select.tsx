import { useState, useContext } from "react";
import { MenuItem, Button, TextField, Grid } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { ModalContext } from "lib/context/modal";
import Receipt from "./index";
import ReceiptSummary from "./summary";
import { PosApiAPI } from "lib/api/pos-api";

const EbarimtSelect = ({ FolioID }: any) => {
    const { handleModal }: any = useContext(ModalContext);

    const [billType, setBillType] = useState<any>(1);
    const [company, setCompany] = useState<any>(null);
    const [loading, setLoading] = useState<any>(null);
    const [customer, setCustomer] = useState<any>(null);

    const handleBillType = (event: SelectChangeEvent) => {
        setBillType(event.target.value as string);
        if ((event.target.value as string) == "1") {
            setCustomer(null);
        }
    };

    const onCheckCompany = async () => {
        try {
            setLoading(true);
            const response = await PosApiAPI.customerName(company);
            if (response) {
                setCustomer(response.data);
            }

            setLoading(false);
        } finally {
        }
    };

    const onPrint = async () => {
        try {
            setLoading(true);

            let values = {
                FolioID: FolioID,
                BillType: billType,
                CompanyID: billType == 1 ? "" : company,
                CompanyName: billType == 1 ? "" : customer.name,
            };

            const response = await PosApiAPI.print(values);

            // if (response) {
            //     window.open("google.com", "_blank");
            // }
            setLoading(false);
        } finally {
        }
    };
    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    {" "}
                    <Select
                        value={billType}
                        onChange={handleBillType}
                        size="small"
                        className="mr-3"
                        fullWidth
                    >
                        <MenuItem key={1} value={1}>
                            Хувь хүн
                        </MenuItem>

                        <MenuItem key={3} value={3}>
                            Албан байгууллага
                        </MenuItem>
                    </Select>
                </Grid>
                {billType == 3 ? (
                    <>
                        {" "}
                        <Grid item xs={6}>
                            <TextField
                                size="small"
                                type="number"
                                id="Port"
                                label="Байгууллагын бүртгэлийн дугаар"
                                margin="dense"
                                className="mt-0"
                                fullWidth
                                onChange={(value) => {
                                    setCompany(value.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                variant={"outlined"}
                                size="small"
                                className="mr-3"
                                // onClick={() => handleInvoice()}
                                style={{ width: "100%" }}
                                onClick={() => {
                                    onCheckCompany();
                                }}
                            >
                                Байгууллага шалгах
                            </Button>
                        </Grid>
                    </>
                ) : (
                    <></>
                )}
                {customer ? <>Байгууллагын нэр :{customer.name} </> : <></>}
                <Grid item xs={12}>
                    <Button
                        variant={"contained"}
                        size="small"
                        className="mr-3"
                        // onClick={() => handleInvoice()}
                        style={{ width: "100%" }}
                        disabled={customer || billType == 1 ? false : true}
                        onClick={() => {
                            onPrint();
                        }}
                    >
                        Хэвлэх
                    </Button>
                </Grid>
            </Grid>

            {/* <Button
                variant={"outlined"}
                size="small"
                className="mr-3"
                // onClick={() => handleInvoice()}
                onClick={() => {
                    handleModal(
                        true,
                        "Receipt",
                        invoiceType == "detail" ? (
                            <Receipt FolioID={FolioID} Lang={Lang} />
                        ) : (
                            <ReceiptSummary FolioID={FolioID} Lang={Lang} />
                        ),
                        null,
                        "large"
                    );
                }}
            >
                Хэвлэх
            </Button> */}
        </>
    );
};

export default EbarimtSelect;
