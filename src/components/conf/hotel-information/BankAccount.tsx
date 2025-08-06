import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { Box, Card, CardContent, Typography, Button, Grid, Chip, IconButton, Divider } from "@mui/material";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import { BankAccountSWR, BankAccountAPI } from "lib/api/bank-account";
import BankAccountNewEdit from "./bank-account-new-edit";
import { ModalContext } from "lib/context/modal";
import { useContext } from "react";
import { Icon } from "@iconify/react";

const BankAccountList = ({ title }: any) => {
  const intl = useIntl();
  const { handleModal }: any = useContext(ModalContext);
  const [search, setSearch] = useState({ Status: true });
  const { data, error, mutate } = BankAccountSWR(search);

  const handleAddNew = () => {
    handleModal(
      true,
      title || "Bank Account",
      <BankAccountNewEdit />,
      "medium"
    );
  };

  const handleEdit = (account: any) => {
    handleModal(
      true,
      "Edit Bank Account",
      <BankAccountNewEdit data={account} />,
      "medium"
    );
  };

  const toggleStatus = async (id: any, currentStatus: boolean) => {
    try {
      await BankAccountAPI.updateStatus(id, !currentStatus);
      mutate();
      toast.success(
        intl.formatMessage({
          id: "MsgStatusUpdated",
          defaultMessage: "Status updated successfully"
        })
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error(
        intl.formatMessage({
          id: "MsgCannotChangeStatus",
          defaultMessage: "Unable to change status."
        })
      );
    }
  };



  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box sx={{ mb: 3, width: "100%", justifyContent: 'space-between', display: "flex", borderBottom: '2px solid #4caf50', pb: 2 }}>
          <div className="flex flex-col items-start">
            <Typography variant="h5" sx={{
              fontWeight: 'bold',
              color: '#4caf50',
              display: 'flex',
              gap: 1
            }}>
              <div className="flex items-center gap-2">
                <Icon icon="mdi:bank" width={24} height={24} />
                {intl.formatMessage({ id: "TextBankAccountInformation" })}
              </div>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {intl.formatMessage({ id: "MsgManageBankAccountDetails" })}
            </Typography>
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={{
              backgroundColor: '#8854e4',
              '&:hover': { backgroundColor: '#8854e4' },
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            {intl.formatMessage({
              id: "ButtonAddNew",
              defaultMessage: "Add New Account"
            })}
          </Button>
        </Box>
      </Box>

      {
        error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {intl.formatMessage({
              id: "MsgErrorLoadingData",
              defaultMessage: "Error loading bank accounts"
            })}
          </Typography>
        )
      }

      <Grid container spacing={2}>
        {data && data.length > 0 ? (
          data.map((account: any, index: number) => (
            <Grid item xs={12} md={6} lg={4} key={account.BankAccountID || account.HotelBankAccountID || index}>
              <Card sx={{
                height: '100%',
                boxShadow: 2,
                '&:hover': { boxShadow: 4 },
                transition: 'box-shadow 0.3s ease'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                      {account.Bank}
                    </Typography>
                    <Chip
                      label={account.Status ?
                        intl.formatMessage({
                          id: "TextActive",
                          defaultMessage: "Active"
                        }) :
                        intl.formatMessage({
                          id: "TextInactive",
                          defaultMessage: "Inactive"
                        })
                      }
                      color={account.Status ? "success" : "default"}
                      size="small"
                      onClick={() => toggleStatus(account.BankAccountID || account.HotelBankAccountID, account.Status)}
                      sx={{ cursor: 'pointer', color: "white", fontWeight: "bold" }}
                    />
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {intl.formatMessage({
                        id: "TextAccountNumber",
                        defaultMessage: "Account Number"
                      })}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {account.AccountNo}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {intl.formatMessage({
                        id: "TextAccountName",
                        defaultMessage: "Account Name"
                      })}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {account.AccountName}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                    <IconButton
                      onClick={() => handleEdit(account)}
                      size="small"
                      sx={{ color: '#1976d2' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Card sx={{ textAlign: 'center', py: 4 }}>
              <CardContent>
                <Typography variant="h6" color="text.secondary">
                  {intl.formatMessage({
                    id: "MsgNoBankAccountsFound",
                    defaultMessage: "No bank accounts found"
                  })}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {intl.formatMessage({
                    id: "MsgClickAddNewAccount",
                    defaultMessage: 'Click "Add New Account" to create your first bank account'
                  })}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box >
  );
};

export default BankAccountList;
