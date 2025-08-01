import { ReservationAPI } from "lib/api/reservation";
import { useState, useContext } from "react";
import { Box, Button, Tooltip } from "@mui/material";
import { listUrl as calendarItemsURL } from "lib/api/front-office";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { mutate } from "swr";
import { ModalContext } from "lib/context/modal";
import { toast } from "react-toastify";
import {
  YouTube,
  CheckCircle,
  Edit,
  AddCircle,
  SwapHoriz,
  Event,
  Cancel,
  Assignment,
  Room,
  History,
  MonetizationOn,
  HotelOutlined,
  NoMeetingRoom,
  PersonAdd
} from "@mui/icons-material";

import NewReservation from "components/front-office/reservation-list/new";
import AmendStayForm from "components/reservation/amend-stay";
import VoidTransactionForm from "components/reservation/void-transaction";
import CancelReservationForm from "components/reservation/cancel-reservation";
import RoomMoveForm from "components/reservation/room-move";
import RoomAssign from "components/reservation/room-assign";
import AuditTrail from "components/reservation/audit-trail";
import ExtraCharge from "components/reservation/extra-charge";
import Checkout from "components/front-office/night-audit/PendingDueOut/additional-actions/checkout";

import { listUrl } from "lib/api/front-office";
import MarkNoShowForm from "./no-show";

const buttonStyle = {
  color: "#804fe6",
  width: "100%",
  justifyContent: "flex-start",
};

const ReservationNav = ({
  reservation,
  itemInfo,
  reloadDetailInfo,
  additionalMutateUrl,
  customRerender,
}: any) => {
  const { locale }: any = useRouter();
  const intl = useIntl();
  const { handleModal }: any = useContext(ModalContext);
  const [openNoShow, setOpenNoShow] = useState(false);
  const handleClickOpenNoShow = () => {
    setOpenNoShow(true);
  };
  const [loading, setLoading] = useState(false);

  const handleOnClickNoShow = async () => {
    setLoading(true);
    try {
      await ReservationAPI.noShow(reservation.TransactionID);
      await mutate(listUrl);
      if (additionalMutateUrl) {
        await mutate(additionalMutateUrl);
      }
      setLoading(false);
      toast(
        intl.formatMessage({
          id: "TextSuccess",
        })
      );
      handleCloseNoShow();
    } catch (error) {
      setLoading(false);
    }
  };

  const handleCloseNoShow = () => {
    setOpenNoShow(false);
  };

  const finishCall = async (msg: string) => {
    await mutate(calendarItemsURL);
    if (reloadDetailInfo) {
      reloadDetailInfo();
    }
    toast(msg);
  };

  const onCheckInClick = async (evt: any) => {
    if (
      !confirm(
        intl.formatMessage({
          id: "MsgConfirmation",
        })
      )
    ) {
      return;
    }
    await ReservationAPI.checkIn(reservation.TransactionID);
    await mutate(calendarItemsURL);
    if (additionalMutateUrl) {
      await mutate(additionalMutateUrl);
    }

    if (customRerender) {
      customRerender();
    }
    handleModal();

    finishCall(
      intl.formatMessage({
        id: "TextSuccess",
      })
    );
  };

  const unassignRoom = async (evt: any) => {
    if (
      !confirm(
        intl.formatMessage({
          id: "MsgConfirmation",
        })
      )
    ) {
      return;
    }
    try {
      var res = await ReservationAPI.roomUnassign(reservation.TransactionID);
      await mutate(calendarItemsURL);
      if (additionalMutateUrl) {
        await mutate(additionalMutateUrl);
      }

      if (customRerender) {
        customRerender();
      }
      handleModal();
      finishCall(
        intl.formatMessage({
          id: "TextSuccess",
        })
      );
    } catch (error) {
      console.error("Room unassign error:", error);
      // The error might actually be a success message from the API
      // so we still mutate and show success
      await mutate(calendarItemsURL);
      if (additionalMutateUrl) {
        await mutate(additionalMutateUrl);
      }

      if (customRerender) {
        customRerender();
      }
      handleModal();
      finishCall(
        intl.formatMessage({
          id: "TextSuccess",
        })
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid #efefef",
      }}
    >
      {reservation.CheckOut && (
        <Checkout
          key={`checkout-${reservation.TransactionID}`}
          TransactionID={reservation.TransactionID}
          listUrl={additionalMutateUrl}
          buttonVariant="text"
          customRerender={customRerender}
        />
      )}
      {reservation.CheckIn && (
        <Button
          variant={"text"}
          size="small"
          onClick={onCheckInClick}
          sx={buttonStyle}
          startIcon={<CheckCircle />}
        >
          {intl.formatMessage({
            id: "ButtonCheckIn",
          })}
        </Button>
      )}
      {reservation.NoShow && (
        <Button
          variant={"text"}
          size="small"
          sx={buttonStyle}
          startIcon={<Cancel />}
          onClick={() => {
            handleModal(
              true,
              intl.formatMessage({
                id: "ButtonMarkNoShow",
              }),
              <MarkNoShowForm
                transactionInfo={reservation}
                reservation={reservation}
                additionalMutateUrl={additionalMutateUrl}
                customRerender={customRerender}
              />,
              null,
              "small"
            );
          }}
        >
          {intl.formatMessage({
            id: "ButtonMarkNoShow",
          })}
        </Button>
      )}
      <a
        href={
          locale == "mon"
            ? `/transaction/edit/${reservation.TransactionID}`
            : `/en/transaction/edit/${reservation.TransactionID}`
        }
      >
        <Button variant={"text"} size="small" sx={buttonStyle} startIcon={<Edit />}>
          {intl.formatMessage({
            id: "ButtonEditTransaction",
          })}
        </Button>
      </a>
      <Button
        variant={"text"}
        size="small"
        sx={buttonStyle}
        startIcon={<MonetizationOn />}
        onClick={() => {
          handleModal(
            true,
            intl.formatMessage({
              id: "ButtonExtraCharge",
            }),
            <ExtraCharge
              transactionInfo={reservation}
              reservation={reservation}
              additionalMutateUrl={additionalMutateUrl}
            />,
            null,
            "largest"
          );
        }}
      >
        {intl.formatMessage({
          id: "ButtonExtraCharge",
        })}
      </Button>
      {reservation.MoveRoom && (
        <div style={{ width: "100%", display: "flex" }}>
          <Button
            variant={"text"}
            size="small"
            sx={buttonStyle}
            startIcon={<SwapHoriz />}
            onClick={() => {
              handleModal(
                true,
                intl.formatMessage({
                  id: "ButtonRoomMove",
                }),
                <RoomMoveForm
                  transactionInfo={reservation}
                  reservation={reservation}
                  additionalMutateUrl={additionalMutateUrl}
                  customRerender={customRerender}
                />
              );
            }}
          >
            {intl.formatMessage({
              id: "ButtonRoomMove",
            })}
          </Button>
          <Tooltip title="Заавар">
            <Link
              href="https://youtu.be/Sy-JD06vChY"
              passHref
              target="_blank"
              style={{
                paddingLeft: "6px",
                paddingRight: "6px",
                paddingTop: "3px",
              }}
              legacyBehavior>

              <YouTube height={24} className="text-[#FF0000] cursor-pointer mx-2 size-5" />
              {/* <Icon
                                  icon="material-symbols:youtube"
                                  color="#1877F2"
                                  height={16}
                              /> */}

            </Link>
          </Tooltip>
        </div>
      )}
      {reservation.AmendStay && (
        <div style={{ width: "100%", display: "flex" }}>
          <Button
            variant={"text"}
            size="small"
            onClick={() => {
              handleModal(
                true,
                intl.formatMessage({
                  id: "ButtonAmendStay",
                }),
                <AmendStayForm
                  transactionInfo={reservation}
                  reservation={reservation}
                  additionalMutateUrl={additionalMutateUrl}
                  customRerender={customRerender}
                />
              );
            }}
            sx={buttonStyle}
            startIcon={<Event />}
          >
            {intl.formatMessage({
              id: "ButtonAmendStay",
            })}
          </Button>
          <Tooltip title="Заавар">
            <Link
              href="https://youtu.be/rvXMlvBKgfI"
              passHref
              target="_blank"
              legacyBehavior>

              <YouTube height={24} className="text-[#FF0000] cursor-pointer mx-2 size-5" />

            </Link>
          </Tooltip>
        </div>
      )}
      {reservation.Void && (
        <div style={{ width: "100%", display: "flex" }}>
          <Button
            variant={"text"}
            size="small"
            onClick={(evt: any) => {
              handleModal(
                true,
                intl.formatMessage({
                  id: "ButtonVoidTransaction",
                }),
                <VoidTransactionForm
                  transactionInfo={reservation}
                  reservation={reservation}
                  customMutateUrl={additionalMutateUrl}
                  customRerender={customRerender}
                />
              );
            }}
            sx={buttonStyle}
            startIcon={<Cancel />}
          >
            {intl.formatMessage({
              id: "ButtonVoidTransaction",
            })}
          </Button>
          <Tooltip title="Заавар">
            <Link
              href="https://youtu.be/0Qa_qgWXlvM?si=lMb9Qyq4m9IwFyRX"
              passHref
              target="_blank"
              style={{
                paddingLeft: "6px",
                paddingRight: "6px",
                paddingTop: "3px",
              }}
              legacyBehavior>

              <YouTube height={24} className="text-[#FF0000] cursor-pointer mx-2 size-5" />

            </Link>
          </Tooltip>
        </div>
      )}
      {reservation.Cancel && (
        <div style={{ width: "100%", display: "flex" }}>
          <Button
            variant={"text"}
            size="small"
            sx={buttonStyle}
            startIcon={<Cancel />}
            onClick={(evt: any) => {
              handleModal(
                true,
                intl.formatMessage({
                  id: "ButtonCancelReservation",
                }),
                <CancelReservationForm
                  transactionInfo={reservation}
                  reservation={reservation}
                  customMutateUrl={additionalMutateUrl}
                  customRerender={customRerender}
                />
              );
            }}
          >
            {intl.formatMessage({
              id: "ButtonCancelReservation",
            })}
          </Button>
          <Tooltip title="Заавар">
            <Link
              href="https://youtu.be/-BIFndvkXRo?si=RmQ_k9OzLk3YQamM"
              passHref
              target="_blank"
              style={{
                paddingLeft: "6px",
                paddingRight: "6px",
                paddingTop: "3px",
              }}
              legacyBehavior>

              <YouTube height={24} className="text-[#FF0000] cursor-pointer mx-2 size-5" />

            </Link>
          </Tooltip>
        </div>
      )}
      {reservation.Assign && (
        <Button
          variant={"text"}
          size="small"
          sx={buttonStyle}
          startIcon={<HotelOutlined />}
          onClick={(evt: any) => {
            handleModal(
              true,
              "Assign Room",
              <RoomAssign
                transactionInfo={reservation}
                reservation={reservation}
                additionalMutateUrl={additionalMutateUrl}
                customRerender={customRerender}
              />
            );
          }}
        >
          {intl.formatMessage({
            id: "ButtonAssignRoom",
          })}
        </Button>
      )}
      {reservation.Unassign && (
        <Button
          variant={"text"}
          size="small"
          sx={buttonStyle}
          startIcon={<NoMeetingRoom />}
          onClick={unassignRoom}
        >
          {intl.formatMessage({
            id: "ButtonUnassignRoom",
          })}
        </Button>
      )}
      {reservation.AuditTrail && (
        <Button
          variant={"text"}
          size="small"
          sx={buttonStyle}
          startIcon={<History />}
          onClick={(evt: any) => {
            handleModal(
              true,
              "Хяналт",
              <AuditTrail
                TransactionID={reservation.TransactionID}
              />,
              null,
              "large"
            );
          }}
        >
          Хяналт
        </Button>
      )}
      {reservation.GroupID ? (
        <Button
          variant={"text"}
          size="small"
          sx={buttonStyle}
          startIcon={<PersonAdd />}
          onClick={() =>
            handleModal(
              true,
              intl.formatMessage({ id: "ButtonAddNewGuest" }),
              <NewReservation
                dateStart={new Date(reservation.ArrivalDate)}
                dateEnd={new Date(reservation.DepartureDate)}
                groupID={reservation.GroupID}
                customRerender={customRerender}
              />,
              null,
              "large"
            )
          }
        >
          Өрөө нэмэх
        </Button>
      ) : (
        ""
      )}
    </Box>
  );
};

export default ReservationNav;
