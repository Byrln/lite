import CustomTable from "components/common/custom-table";
import { ReservationLogSWR, listUrl } from "lib/api/reservation";
import React from "react";

const columns = [
    { title: "Үйлдэл", key: "Action", dataIndex: "Action" },
    {
        title: "Тайлбар",
        key: "Description",
        dataIndex: "Description",
        render: (id: any, value: string, record: any) => {
            // Format the Description field for better readability
            if (!value) return "";
            
            // Handle different formats based on the Action type
            let formattedValue = value;
            
            // Common formatting for all types
            // Replace semicolons with line breaks
            formattedValue = formattedValue.replace(/;/g, "\n");
            
            // Replace equals signs with spaces and colons for better readability
            formattedValue = formattedValue.replace(/=/g, ": ");
            
            // Format ID patterns like (ID:123) to be more readable
            formattedValue = formattedValue.replace(/\(ID:(\d+)\)/g, "(ID: $1)");
            
            // Format patterns like "Guest: { test => test12 }" for better readability
            formattedValue = formattedValue.replace(/\{\s*([^}]+)\s*\}/g, (match, content) => {
                // Add line breaks before and after the content inside curly braces
                return "\n{\n  " + content.trim().replace(/=>/g, "→") + "\n}";
            });
            
            // Format key-value pairs with commas (e.g., "Reservation No:360, Reservation Type:Corporate")
            if (formattedValue.includes(",")) {
                formattedValue = formattedValue.split(",").join("\n");
            }
            
            // Apply specific styling based on the action type
            const actionType = record.Action;
            let style = { 
                whiteSpace: "pre-line", 
                fontFamily: "monospace",
                padding: "4px 8px",
                borderRadius: "4px",
                backgroundColor: "#f5f5f5"
            };
            
            return <div style={style}>{formattedValue}</div>;
        },
    },
    { title: "Өдөр", key: "CreatedDate", dataIndex: "CreatedDate" },
    { title: "Хэрэглэгч", key: "UserName", dataIndex: "UserName" },
    { title: "Сүлжээний хаяг", key: "IPAddress", dataIndex: "IPAddress" },
];

const RoomList = ({ TransactionID }: any) => {
    const { data, error } = ReservationLogSWR(TransactionID, null);

    return (
        <>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                id="TransactionActionID"
                listUrl={listUrl}
                excelName="Хяналт"
                hasNew={false}
                hasDelete={false}
                hasShow={false}
            />
        </>
    );
};

export default RoomList;
