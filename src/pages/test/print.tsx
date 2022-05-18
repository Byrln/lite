import {useRef} from "react";
// import { useReactToPrint } from "react-to-print";
// import { Button, Skeleton, Alert } from "antd";
// import { PrinterOutlined } from "@ant-design/icons";
// import useSWR from "swr";
// import QRCode from "react-qr-code";
// import html2canvas from "html2canvas";
// import {
//     exportComponentAsJPEG,
//     exportComponentAsPDF,
//     exportComponentAsPNG,
// } from "react-component-export-image";

const Print = ({id}: any) => {
    const componentRef: any = useRef<HTMLDivElement>(null);
    // const { data: { data: data } = {}, error } = useSWR(`/user/my-info/${id}`);

    // const handlePrint = useReactToPrint({
    //     content: () => componentRef.current,
    // });

    const handleDownloadPdf = async () => {
        var windowContent = "<!DOCTYPE html>";
        windowContent += "<html>";
        windowContent += "<head><title>Print canvas</title></head>";
        windowContent += "<body>";
        windowContent +=
            '<img src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg">';
        windowContent += "</body>";
        windowContent += "</html>";
        const printWin = window.open("", "", "width=1016,height=638");
        // const element = componentRef.current;
        // const canvas = await html2canvas(element);
        // const data = canvas.toDataURL("image/png");



        printWin?.open();
        printWin?.document.write(windowContent);
        // printWin?.document.close();
        // printWin?.focus();

        setTimeout(function () {
            printWin?.print();
        }, 500);

        // printWin?.close();
    };

    const printImg = async () => {
        // const element = componentRef.current;
        // const canvas = await html2canvas(element);
        // const data = canvas.toDataURL("image/png");

        const printWin = window.open("http://localhost:3000/test/printscreen", "", "width=1016,height=638");
        printWin?.open();
        // printWin?.focus();
        // printWin?.print();
        // printWin?.close();
    };

    // if (error)
    //     return <Alert message={`Алдаа: ${error}`} type="error" showIcon />;
    //
    // if (!error && !data) return <Skeleton active />;

    return (
        <>
            {/*<Button onClick={handlePrint} className="mr-3 mb-3">*/}
            {/*    <PrinterOutlined /> Хэвлэх*/}
            {/*</Button>*/}

            <div onClick={handleDownloadPdf}>asd</div>

            <div
                ref={componentRef}
                style={{
                    width: "850px",
                    height: "540px",
                    border: "1px solid",
                    display: "table-cell",
                    position: "relative",
                    borderRadius: "15px",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        left: "0px",
                        bottom: "240px",
                        width: "180px",
                        height: "140px",
                    }}
                >
                    <span
                        style={{
                            fontWeight: "bold",
                            writingMode: "vertical-rl",
                            transform: "translateY(-50%) rotate(-180deg)",
                            position: "absolute",
                            left: "0",
                            top: "50%",
                            letterSpacing: "5px",
                        }}
                    >
                        asfasf
                    </span>
                    <div
                        style={{
                            background: `url(https://www.faketemplate.com/wp-content/uploads/2020/06/netherlands-id-card-template-01.jpg) no-repeat center center / cover`,
                            marginLeft: "24px",
                            width: "156px",
                            height: "100%",
                        }}
                    ></div>
                </div>
                <div
                    style={{
                        position: "absolute",
                        left: "0px",
                        bottom: "0px",
                        width: "180px",
                        height: "180px",
                        textAlign: "center",
                        background: "yellow"
                    }}
                >
                    {/*<QRCode value={"asdasd"} size={168} />*/}
                </div>
            </div>
        </>
    );
};

export default Print;