/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Typography, Divider } from "@mui/material";
import Link from "next/link";
import { Icon } from "@iconify/react";

import CustomTab from "components/common/custom-tab";
import GeneralForm from "./GeneralForm";
import BankAccount from "./BankAccount";
import BookingEngine from "./BookingEngine";
import Banner from "./Banner";
import MainPictures from "./MainPictures";
import { useIntl } from "react-intl";

const HotelInformation = ({ setHasData = null }: any) => {
  const intl = useIntl();
  const tabs = [
    {
      label: intl.formatMessage({ id: "TextGeneralInformation" }),
      component: (
        <>
          <GeneralForm setHasData={setHasData} />
        </>
      ),
    },
    {
      label: intl.formatMessage({ id: "TextBookingEngine" }),
      component: (
        <>
          <BookingEngine />
          <BankAccount title={"Банкны данс"} />
          <Banner />
          <MainPictures />
        </>
      ),
    },
  ];

  // @ts-ignore
  return (
    <Box sx={{ p: 2, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 1 }}>
            {intl.formatMessage({
              id: "MenuHotelInformation",
            })}
          </Typography>
        </Box>
        <Link
          href="https://youtu.be/Z8x-TXO4cM0?si=i_qfV0cAlALJ0LSy"
          passHref
          target="_blank"
          className="cursor-pointer"
          style={{
            paddingLeft: "6px",
            paddingRight: "6px",
            paddingTop: "3px",
          }}>
          <Icon
            className="cursor-pointer"
            icon="mdi:youtube"
            color="#FF0000"
            height={24}
          />
        </Link>
      </Box>

      {/* Main Content */}
      <Box sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 1, overflow: 'hidden' }}>
        <CustomTab tabs={[
          {
            label: intl.formatMessage({ id: "TextGeneralInformation" }),
            component: (
              <>
                <GeneralForm setHasData={setHasData} />
              </>
            ),
          },
          {
            label: intl.formatMessage({ id: "TextBookingEngine" }),
            component: (
              <Box sx={{ p: 4, bgcolor: '#fafafa', minHeight: '100vh' }}>
                {/* Booking Engine Configuration Section */}
                <Box sx={{
                  mb: 5,
                  p: 4,
                  bgcolor: 'white',
                  borderRadius: 3,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e0e0e0'
                }}>
                  <Box sx={{ mb: 3, borderBottom: '2px solid #1976d2', pb: 2 }}>
                    <Typography variant="h5" sx={{
                      fontWeight: 'bold',
                      color: '#1976d2',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <Icon icon="mdi:cog" width={24} height={24} />
                      {intl.formatMessage({ id: "TextBookingEngineConfiguration" })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {intl.formatMessage({ id: "TextBookingEngineConfigurationDescription" })}
                    </Typography>
                  </Box>
                  <BookingEngine />
                </Box>

                {/* Financial Information Section */}
                <Box sx={{
                  mb: 5,
                  p: 4,
                  bgcolor: 'white',
                  borderRadius: 3,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e0e0e0'
                }}>
                  <BankAccount title={"Банкны данс"} />
                </Box>

                {/* Visual Content Section */}
                <Box sx={{
                  mb: 5,
                  p: 4,
                  bgcolor: 'white',
                  borderRadius: 3,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e0e0e0'
                }}>
                  <Box sx={{ mb: 3, borderBottom: '2px solid #ff9800', pb: 2 }}>
                    <Typography variant="h5" sx={{
                      fontWeight: 'bold',
                      color: '#ff9800',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <Icon icon="mdi:image-multiple" width={24} height={24} />
                      {intl.formatMessage({ id: "TextVisualContentManagement" })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {intl.formatMessage({ id: "TextVisualContentManagementDescription" })}
                    </Typography>
                  </Box>

                  {/* Banner Subsection */}
                  <Box sx={{ mb: 4 }}>
                    <Banner />
                  </Box>

                  {/* Main Pictures Subsection */}
                  <Box>
                    <MainPictures />
                  </Box>
                </Box>
              </Box>
            ),
          },
        ]} />
      </Box>
    </Box>
  );
};

export default HotelInformation;
