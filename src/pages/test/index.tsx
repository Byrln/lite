import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import { withAuthServerSideProps } from "../../lib/utils/withAuthServerSideProps";
import moment from "react-moment";
import StayViewApi from "../../lib/api/stay-view";
import Button from "@mui/material/Button";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

const TestPage = (props: any) => {
  const [roomsData, setRoomsData] = useState([]);

  const arrTest = new Array(100).fill(1);

  const roomLoad = async (e: any) => {
    console.log(e);
    let values = {
      CurrDate: "2021-10-24",
      NumberOfDays: 15,
      RoomTypeID: 1,
    };

    const resultData = await StayViewApi.list(values);
    if (resultData.status == "success") {
      setRoomsData(resultData.result);
    }
  };

  const windowScroll = (e: any) => {
    console.log(e);
  };

  useEffect(() => {
    window.addEventListener("scroll", windowScroll);

    return () => {
      window.removeEventListener("scroll", windowScroll);
    };
  }, []);

  return (
    <>
      <h4>Testing</h4>
      <p>Static text</p>
      <p>{props.name}</p>

      {/* RoomTypeID: 13,
    RoomTypeName: 'President room',
    RoomID: 18,
    RoomNo: '701',
    HKStatus: 13,
    D1: '',
    D2: '', */}

      <Button variant="contained" color="success" onClick={roomLoad}>
        Load
      </Button>

      <table>
        <thead>
          <tr>
            <th>Room type ID</th>
            <th>Room Type</th>
            <th>Room No</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {roomsData.map((roomInfo: any, index: number) => {
            return (
              <tr key={index}>
                <td>{roomInfo.RoomTypeID}</td>
                <td>{roomInfo.RoomTypeName}</td>
                <td>{roomInfo.RoomNo}</td>
                <td>{roomInfo.HKStatus}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {arrTest.map((num: number, index: number) => {
        return <p key={index}>Quick brown fox jumps over lazy dog...</p>;
      })}
    </>
  );
};

const getServerSideProps: GetServerSideProps = withAuthServerSideProps(
  async () => {
    return {
      props: {
        name: "test name",
        data: [],
      },
    };
  }
);

export default TestPage;
export { getServerSideProps };
