import { useState, useRef, useEffect } from "react";
import moment from "moment";
import {
    Typography,
    Grid,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import ScrollContainer from "react-indiana-drag-scroll";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";

import { ReportBalanceSWR } from "lib/api/report";
import { dateStringToObj } from "lib/utils/helpers";

const ReportingList = ({ title, workingDate }: any) => {
    const componentRef: any = useRef<HTMLDivElement>(null);

    const [search, setSearch] = useState({
        StartDate: moment(
            dateStringToObj(moment(workingDate).format("YYYY-MM-DD")),
            "YYYY-MM-DD"
        ).format("YYYY-MM-DD"),
        EndDate: moment(dateStringToObj(workingDate))
            .add(1, "months")
            .startOf("day")
            .format("YYYY-MM-DD"),
    });

    const { data, error } = ReportBalanceSWR(search);

    const handlePrint = useReactToPrint({
        pageStyle: `@media print {
            @page {
              padding: 20px;
            }
          }`,
        content: () => componentRef.current,
    });

    return (
        <>
            <Button
                variant="outlined"
                onClick={handlePrint}
                className="mr-3"
                startIcon={<PrintIcon />}
            >
                Хэвлэх
            </Button>

            <div ref={componentRef}>
                <Typography
                    variant="h6"
                    gutterBottom
                    style={{ textAlign: "center" }}
                    className="mb-3"
                >
                    Үлдэгдлийн тайлан
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        {" "}
                        <Typography
                            variant="body1"
                            gutterBottom
                            className="mr-1"
                        >
                            <span style={{ fontWeight: "bold" }}>
                                {" "}
                                Эх.Хугацаа :{" "}
                            </span>{" "}
                            {search.StartDate}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography
                            variant="body1"
                            gutterBottom
                            className="mr-1"
                        >
                            <span style={{ fontWeight: "bold" }}>
                                {" "}
                                Дуус.Хугацаа :{" "}
                            </span>{" "}
                            {search.EndDate}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography
                            variant="body1"
                            gutterBottom
                            className="mr-1"
                        >
                            <span style={{ fontWeight: "bold" }}>
                                {" "}
                                Харилцагч :{" "}
                            </span>{" "}
                            Бүгд
                        </Typography>
                    </Grid>
                </Grid>
            </div>
        </>
    );
};

export default ReportingList;
