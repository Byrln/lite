import { useState, useRef, useEffect } from "react";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { formatPrice } from "lib/utils/helpers";
import { ReportAPI } from "lib/api/report";
import { HotelAPI } from "@/lib/api/hotel";

const GuestRegistrationCard = ({ TransactionID }: any) => {
  const componentRef: any = useRef<HTMLDivElement>(null);
  const [guestData, setGuestData]: any = useState(null);
  const [hotelInfo, setHotelInfo]: any = useState(null);
  const [loading, setLoading] = useState(false);

  const loadGuestData = async () => {
    try {
      setLoading(true);
      const res = await ReportAPI.invoiceDetailed({
        FolioID: TransactionID,
        IsInvoice: false,
      });
      if (res && Array.isArray(res)) {
        setGuestData(res);
      } else if (res) {
        setGuestData([res]);
      } else {
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
            .guest-info-table {
                width: 100%;
                border-collapse: collapse;
            }
            .guest-info-table td {
                border: 1px solid #000;
                padding: 8px;
                font-size: 11px;
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

      <div ref={componentRef} className="text-xs p-5">
        {/* Header Section with Hotel Information */}
        <div className="header-sectionpb-2 mb-5">
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
        {/* Fallback Guest Information Layout */}
        {(!guestData || guestData.length === 0 || !guestData[0]) && (
          <div className="grid grid-cols-2 gap-0">
            {/* Left Column - Fallback */}
            <div className="grid grid-rows-8 gap-0">
              <div className="font-bold">
                {guestData?.GuestName || "Guest Name"}
              </div>
              <div className="flex items-center gap-2">
                <strong>Reg No</strong>
                <div></div>
              </div>
              <div className="flex items-center gap-2">
                <strong>Company</strong>
                <div className=""></div>
              </div>
              <div className="flex items-center gap-2">
                <strong>Email</strong>
                <div className=""></div>
              </div>
              <div className="flex items-center gap-2">
                <strong>Phone</strong>
                <div className=""></div>
              </div>
              <div className="flex items-center gap-2">
                <strong>Registry No</strong>
                <div className=""></div>
              </div>
              <div className="flex items-center gap-2">
                <strong>Driver License No</strong>
                <div className=""></div>
              </div>
              <div className="flex items-center gap-2">
                <strong>Country</strong>
                <div className="">MONGOLIA</div>
              </div>
            </div>

            {/* Right Column - Fallback */}
            <div className="grid grid-rows-8 gap-0">
              <div className="grid grid-cols-2 gap-0">
                <div className="flex items-center gap-2">
                  <strong>Arrival Date</strong>
                  <div className="">7/26/2025 2:00:00PM</div>
                </div>
                <div className="flex items-center gap-2">
                  <strong>Room Type</strong>
                  <div className="">M16/Монгол гэр</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-0">
                <div className="flex items-center gap-2">
                  <strong>Departure Date</strong>
                  <div className="">7/30/2025 12:00:00PM</div>
                </div>
                <div className="flex items-center gap-2">
                  <strong>Daily Rate</strong>
                  <div className="">0.00</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-0">
                <div className="flex items-center gap-2">
                  <strong>Nights</strong>
                  <div className="">4</div>
                </div>
                <div className="flex items-center gap-2">
                  <strong>Total</strong>
                  <div className="">0.00</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-0">
                <div className="flex items-center gap-2">
                  <strong>Address</strong>
                  <div className=""></div>
                </div>
                <div className="p-2"></div>
              </div>
            </div>
          </div>
        )}
        {/* Special Requirements Section */}
        <div className="my-2">
          <strong>If you have any special requirements write here</strong>
          <div className="border border-black p-2">
            <div className="min-h-[40px] mt-2">
              {/* This would be filled with actual special requirements data */}
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mt-4">
          <h3 className="text-sm font-bold">
            Үйлчилгээний Нөхцөл::
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