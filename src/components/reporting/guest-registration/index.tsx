import { useState, useRef, useEffect } from "react";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { formatPrice } from "lib/utils/helpers";
import { ReportAPI } from "lib/api/report";
import { TransactionAPI } from "lib/api/transaction";
import { GuestAPI } from "lib/api/guest";
import { HotelAPI } from "@/lib/api/hotel";

const GuestRegistrationCard = ({ TransactionID }: any) => {
  const componentRef: any = useRef<HTMLDivElement>(null);
  const [guestData, setGuestData]: any = useState(null);
  const [hotelInfo, setHotelInfo]: any = useState(null);
  const [loading, setLoading] = useState(false);

  const loadGuestData = async () => {
    try {
      setLoading(true);
      console.log("TransactionID received:", TransactionID); // Debug log

      // First try to get transaction details using TransactionAPI
      const transactionRes = await TransactionAPI.get(TransactionID);
      console.log("Transaction data response:", transactionRes); // Debug log

      if (transactionRes) {
        let combinedData = { ...transactionRes };

        // Get guest details if GuestID is available
        if (transactionRes.GuestID) {
          try {
            const guestRes = await GuestAPI.get(transactionRes.GuestID);
            console.log("Guest data response:", guestRes); // Debug log
            combinedData.guestDetails = guestRes;
          } catch (guestError) {
            console.warn("Could not load guest details:", guestError);
          }
        }

        // Also try to get detailed invoice data using FolioID
        if (transactionRes.FolioID) {
          try {
            const invoiceRes = await ReportAPI.invoiceDetailed({
              FolioID: transactionRes.FolioID,
              IsInvoice: false,
              Lang: "MN"
            });
            console.log("Invoice data response:", invoiceRes); // Debug log
            combinedData.invoiceDetails = invoiceRes;
          } catch (invoiceError) {
            console.warn("Could not load invoice details:", invoiceError);
          }
        }

        setGuestData([combinedData]);
      } else {
        console.warn("No transaction data found for TransactionID:", TransactionID);
        setGuestData(null);
      }
    } catch (error) {
      console.error("Error loading guest data:", error);
      setGuestData(null);
    } finally {
      setLoading(false);
    }
  };

  const loadHotelInfo = async () => {
    try {
      const hotelRes = await HotelAPI.get();
      setHotelInfo(hotelRes[0]);
    } catch (error) {
      console.error("Error loading hotel info:", error);
    }
  };

  useEffect(() => {
    if (TransactionID) {
      loadGuestData();
      loadHotelInfo();
    }
  }, [TransactionID]);

  const handlePrint = useReactToPrint({
    pageStyle: `@media print {
            @page {
                size: A4;
                margin: 20mm;
                font-size: 12px;
            }
            body {
                font-family: Arial, sans-serif;
                line-height: 1.4;
            }
            .header-section {
                border-bottom: 2px solid #000;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            .terms-section {
                margin-top: 20px;
                font-size: 10px;
                line-height: 1.3;
            }
            .signature-section {
                margin-top: 30px;
                display: flex;
                justify-content: space-between;
            }
        }`,
    content: () => componentRef.current,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>


      <div className="flex mb-5">
        <Button
          variant="outline"
          onClick={handlePrint}
          className="mr-3"
          disabled={!guestData}
        >
          <Printer className="w-4 h-4 mr-2" />
          Хэвлэх
        </Button>
      </div>

      {/* Debug section - remove in production
      {guestData && (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Debug - Guest Data Structure:</h3>
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify(guestData, null, 2)}
          </pre>
        </div>
      )} */}

      <div ref={componentRef} className="text-xs p-5">
        {/* Header Section with Hotel Information */}
        <div className="pb-2 mb-5">
          <div className="flex">
            <div className="flex-1 text-right">
              <h2 className="text-xl font-bold mb-2">
                {hotelInfo?.CompanyName || "Hotel Name"}
              </h2>
              <div className="text-xs">
                <div><strong>Address:</strong> {hotelInfo?.Address1 || ""} <br />         {hotelInfo?.Address2 || ""}</div>
                <div><strong>Phone:</strong> {hotelInfo?.ReceptionPhone || ""}</div>
                <div><strong>Email:</strong> {hotelInfo?.ReserveEmail || ""}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Guest Registration Card Title */}
        <h1 className="text-2xl font-bold text-center my-5">
          Guest Registration Card
        </h1>
        {/* Guest Information Layout */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {/* Left Column */}
          <div className="space-y-1">
            <div className="grid grid-cols-[80px_1fr] gap-1 items-center">
              <strong className="text-xs">Нэр:</strong>
              <span className="text-xs">{guestData && guestData[0] ? guestData[0].GuestName || (guestData[0].guestDetails?.GuestFullName) || "Guest Name" : "Guest Name"}</span>
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-1 items-center">
              <strong className="text-xs">Reg No:</strong>
              <span className="text-xs">{guestData && guestData[0] ? guestData[0].TransactionID || "" : ""}</span>
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-1 items-center">
              <strong className="text-xs">Company:</strong>
              <span className="text-xs">{guestData && guestData[0]?.guestDetails ? guestData[0].guestDetails.Company || "" : ""}</span>
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-1 items-center">
              <strong className="text-xs">Email:</strong>
              <span className="text-xs">{guestData && guestData[0]?.guestDetails ? guestData[0].guestDetails.Email || "" : ""}</span>
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-1 items-center">
              <strong className="text-xs">Phone:</strong>
              <span className="text-xs">{guestData && guestData[0]?.guestDetails ? guestData[0].guestDetails.Mobile || guestData[0].guestDetails.Phone || "" : ""}</span>
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-1 items-center">
              <strong className="text-xs">Registry No:</strong>
              <span className="text-xs">{guestData && guestData[0]?.guestDetails ? guestData[0].guestDetails.RegistryNo || "" : ""}</span>
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-1 items-center">
              <strong className="text-xs">Driver License:</strong>
              <span className="text-xs">{guestData && guestData[0]?.guestDetails ? guestData[0].guestDetails.DriverLicenseNo || "" : ""}</span>
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-1 items-center">
              <strong className="text-xs">Country:</strong>
              <span className="text-xs">{guestData && guestData[0]?.guestDetails ? guestData[0].guestDetails.CountryName || "MONGOLIA" : "MONGOLIA"}</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-1">
            <div className="grid grid-cols-2 gap-2">
              <div className="grid grid-cols-[60px_1fr] gap-1">
                <strong className="text-xs">Arrival:</strong>
                <div className="text-xs">
                  <div>{guestData && guestData[0] ? moment(guestData[0].ArrivalDate).format("MM/DD/YYYY") : ""}</div>
                  <div>{guestData && guestData[0] ? moment(guestData[0].ArrivalDate).format("hh:mm A") : ""}</div>
                </div>
              </div>
              <div className="grid grid-cols-[60px_1fr] gap-1">
                <strong className="text-xs">Room Type:</strong>
                <span className="text-xs">{guestData && guestData[0] ? guestData[0].RoomFullNo || "" : ""}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid grid-cols-[60px_1fr] gap-1">
                <strong className="text-xs">Departure:</strong>
                <div className="text-xs">
                  <div>{guestData && guestData[0] ? moment(guestData[0].DepartureDate).format("MM/DD/YYYY") : ""}</div>
                  <div>{guestData && guestData[0] ? moment(guestData[0].DepartureDate).format("hh:mm A") : ""}</div>
                </div>
              </div>
              <div className="grid grid-cols-[60px_1fr] gap-1">
                <strong className="text-xs">Daily Rate:</strong>
                <span className="text-xs">{guestData && guestData[0] ? formatPrice(guestData[0].invoiceDetails?.[0]?.DailyRate || 0) : "0.00"}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid grid-cols-[60px_1fr] gap-1">
                <strong className="text-xs">Nights:</strong>
                <span className="text-xs">{guestData && guestData[0] ? guestData[0].Nights || "0" : "0"}</span>
              </div>
              <div className="grid grid-cols-[60px_1fr] gap-1">
                <strong className="text-xs">Total:</strong>
                <span className="text-xs font-semibold">{guestData && guestData[0] ? formatPrice(guestData[0].invoiceDetails?.[0]?.TotalAmount || 0) : "0.00"}</span>
              </div>
            </div>
            <div className="grid grid-cols-[60px_1fr] gap-1">
              <strong className="text-xs">Address:</strong>
              <span className="text-xs">{guestData && guestData[0]?.guestDetails ? guestData[0].guestDetails.Address || "" : ""}</span>
            </div>
          </div>
        </div>
        {/* Special Requirements Section */}
        <div className="my-2">
          <strong>If you have any special requirements write here</strong>
          <div className="border border-black p-2">
            <div className="min-h-[40px] mt-2">
              {guestData && guestData[0] ? guestData[0].SpecialRequirements || guestData[0].Remarks || "" : ""}
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mt-4">
          <h3 className="text-sm font-bold">
            Үйлчилгээний Нөхцөл:
          </h3>
          {hotelInfo?.HotelPolicy}
        </div>
        {/* CancelPolicy */}
        <div className="mt-4">
          <h3 className="text-sm font-bold">
            Цуцлах Бодлого:
          </h3>
          {hotelInfo?.CancelPolicy}
        </div>
        {/* Signature Section */}
        <div className="mt-6 flex justify-center">
          <div className="w-[45%]">
            <p className="text-xs">
              Guest Signature
            </p>
            <div className="flex"><hr className="w-[60%] border-black" /> <hr className="w-[100%] ml-2 border-dotted border-black" /></div>
            <p className="text-xs">
              Зочны гарын үсэг
            </p>
          </div>
        </div>
      </div >
    </>
  );
};

export default GuestRegistrationCard;