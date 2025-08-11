import { useContext, useState, useEffect } from "react";
import { Box, Alert, Skeleton, Menu, MenuItem, Button } from "@mui/material";
import { mutate } from "swr";
import { useIntl } from "react-intl";

import {
  SharerListSWR,
  SharerListAPI,
  listUrl,
} from "lib/api/reservation-sharer";
import axios from "lib/utils/axios";
import CustomTable from "components/common/custom-table";
import { ModalContext } from "lib/context/modal";
import { useAppState } from "lib/context/app";
import GuestNewEdit from "components/front-office/guest-database/new-edit";
import GuestDocuments from "components/common/custom-upload";
import NewEdit from "./new-edit";
import GroupIcon from '@mui/icons-material/Group';

const SharerInformation = ({ TransactionID }: any) => {
  const intl = useIntl();
  const { data, error } = SharerListSWR(TransactionID);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const { handleModal }: any = useContext(ModalContext);
  const [state, dispatch]: any = useAppState();

  const deleteSharer = async () => {
    if (!confirm(intl.formatMessage({ id: 'common.confirmDelete' }))) {
      return;
    }

    await SharerListAPI.delete({
      TransactionID: TransactionID,
      GuestID: selectedRow.GuestID,
    });

    await mutate(`${listUrl}/${TransactionID}`);
  };

  const handleClick = (event: any, row: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  if (error) return <Alert severity="error">{error.message}</Alert>;

  if (!error && !data)
    return (
      <Box sx={{ width: "100%" }}>
        <Skeleton />
        <Skeleton animation="wave" />
        <Skeleton animation={false} />
      </Box>
    );

  const columns = [
    {
      title: "№",
      key: "rowNumber",
      dataIndex: "rowNumber",
      render: (id: any, value: any, element: any, dataIndex: any) => {
        return dataIndex + 1;
      },
    },
    {
      title: intl.formatMessage({ id: 'transaction.sharer.guestName' }),
      key: "GuestName",
      dataIndex: "GuestName",
    },
    {
      title: intl.formatMessage({ id: 'transaction.sharer.gender' }),
      key: "Gender",
      dataIndex: "Gender",
    },
    {
      title: intl.formatMessage({ id: 'transaction.sharer.actions' }),
      key: "Action",
      dataIndex: "Action",
      width: 250,
      __ignore__: true,
      excelRenderPass: true,
      render: (id: any, value: any, element: any, dataIndex: any) => {
        return (
          <>
            <Button
              aria-controls={`menu${id}`}
              variant={"outlined"}
              size="small"
              onClick={(e) => handleClick(e, element)}
            >
              {intl.formatMessage({ id: 'common.actions' })}
            </Button>

            <Menu
              id={`menu${id}`}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <>
                <MenuItem
                  key={`guestEdit`}
                  onClick={() => {
                    handleModal(
                      true,
                      intl.formatMessage({ id: 'transaction.sharer.editGuest' }),
                      <GuestNewEdit />
                    );
                    dispatch({
                      type: "isShow",
                      isShow: false,
                    });
                    dispatch({
                      type: "editId",
                      editId: selectedRow.GuestID,
                    });
                    handleClose();
                  }}
                >
                  {intl.formatMessage({ id: 'transaction.sharer.editGuest' })}
                </MenuItem>
                <MenuItem
                  key={`guestPictureImport`}
                  onClick={() => {
                    handleModal(
                      true,
                      intl.formatMessage({ id: 'transaction.sharer.uploadPhoto' }),
                      <GuestDocuments
                        GuestID={selectedRow.GuestID}
                      />
                    );
                    handleClose();
                  }}
                >
                  {intl.formatMessage({ id: 'transaction.sharer.uploadPhoto' })}
                </MenuItem>
                <MenuItem
                  key={`guestDocumentImport`}
                  onClick={() => {
                    handleModal(
                      true,
                      intl.formatMessage({ id: 'transaction.sharer.uploadDocument' }),
                      <GuestDocuments
                        GuestID={selectedRow.GuestID}
                        IsDocument={true}
                      />
                    );
                    handleClose();
                  }}
                >
                  {intl.formatMessage({ id: 'transaction.sharer.uploadDocument' })}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    deleteSharer();
                    handleClose();
                  }}
                >
                  {intl.formatMessage({ id: 'common.delete' })}
                </MenuItem>
              </>
            </Menu>
          </>
        );
      },
    },
  ];

  return (
    <Box>
      {/* Debug indicator */}
      {/* <Box sx={{ backgroundColor: 'yellow', padding: 1, marginBottom: 1, fontSize: '12px' }}>
        DEBUG: SharerInformation component is rendering. TransactionID: {TransactionID}, Data length: {data?.length || 0}
      </Box> */}
      <CustomTable
        columns={columns}
        data={data}
        error={error}
        modalTitle={intl.formatMessage({ id: 'transaction.sharer.title' })}
        excelName={intl.formatMessage({ id: 'transaction.sharer.title' })}
        hasNew={true}
        pagination={false}
        datagrid={false}
        hasPrint={false}
        hasExcel={false}
        id="GuestID"
        api={SharerListAPI}
        modalContent={<NewEdit TransactionID={TransactionID} />}
      />
    </Box>
  );
};

export default SharerInformation;
