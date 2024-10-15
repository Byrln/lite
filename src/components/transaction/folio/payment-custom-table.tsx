import { format } from "date-fns";
import { DataGrid } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { formatPrice } from "lib/utils/helpers";
import { calculateColumnsWidth } from "lib/utils/dynamic-columns-helper";

import { FolioItemSWR, FolioAPI, listUrl } from "lib/api/folio";

export default function PaymentCustomTableData({ FolioID }: any) {
    const { data, error }: any = FolioItemSWR(FolioID);

    const columns = [
        {
            headerName: "Өдөр",
            field: "CurrDate",
            dataIndex: "CurrDate",
            __ignore__: true,
            excelRenderPass: true,
            renderCell: (element: any) => {
                return format(
                    new Date(element.row.CurrDate.replace(/ /g, "T")),
                    "MM/dd/yyyy"
                );
            },
            width: 150,
        },
        {
            headerName: "Дүн",
            field: "Amount2",
            dataIndex: "Amount2",
            __ignore__: true,
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        width={120}
                    >
                        <Typography
                            fontSize={12}
                            fontWeight={400}
                            sx={{ wordBreak: "break-word" }}
                        >
                            {formatPrice(element.row.Amount2)}
                        </Typography>
                        <Typography
                            fontSize={12}
                            fontWeight={400}
                            sx={{ wordBreak: "break-word" }}
                        >
                            {element.row.ItemName}
                        </Typography>
                    </Stack>
                );
            },
            width: 200,
        },
        {
            headerName: "Тайлбар",
            field: "Description",
            dataIndex: "Description",
            width: 300,
        },
        {
            headerName: "Хэрэглэгч",
            field: "Username",
            dataIndex: "Username",
            width: 120,
        },
    ];
    const pagination = true;

    return (
        <div>
            <Stack direction="column" spacing={3}>
                <Box sx={{ maxHeight: "500px", width: "100%" }}>
                    <DataGrid
                        rows={data}
                        columns={columns}
                        density="compact"
                        initialState={
                            pagination
                                ? {
                                      pagination: {
                                          paginationModel: {
                                              page: 0,
                                              pageSize: 15,
                                          },
                                      },
                                  }
                                : {
                                      pagination: {
                                          paginationModel: {
                                              pageSize: data?.length, // Set the pageSize to the total number of rows
                                              page: 1,
                                          },
                                      },
                                  }
                        }
                        pageSizeOptions={[5]}
                        disableRowSelectionOnClick
                        getRowId={(row) =>
                            "CurrID" ? row["CurrID"] : row["CurrID"]
                        }
                    />
                </Box>

                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    spacing={1}
                    style={{ marginTop: "10px", padding: "0px" }}
                >
                    <Typography
                        fontSize={18}
                        fontWeight={600}
                        style={{ color: "black" }}
                    >
                        Үлдэгдэл
                    </Typography>

                    <Typography fontSize={24} fontWeight={700} color="#7F49E5">
                        {data && data.length > 0
                            ? formatPrice(
                                  data.reduce(
                                      (acc: any, obj: any) =>
                                          Number(acc) + Number(obj.Amount2),
                                      0
                                  )
                              )
                            : 0}
                        MNT
                    </Typography>
                </Stack>
            </Stack>
        </div>
    );
}
