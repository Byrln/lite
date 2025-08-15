import useSWR from "swr";
import axios from "lib/utils/axios";

export const urlPrefix = "/api/Reservation";
export const listUrl = `${urlPrefix}/List`;

export const ReservationSWR = (search: any) => {
  if (!search) {
    return { data: undefined, error: undefined };
  }
  
  if (!search.ReservationTypeID) {
    search.ReservationTypeID = 1;
  }

  console.log("API call with search parameters:", search);

  const fetcher = async (url: any) => {
    // Fetch reservation data
    const reservationRes = await axios.post(url, search);
    const reservations = reservationRes.data.JsonData;

    if (!reservations || reservations.length === 0) {
      return reservations;
    }

    // Get unique guest IDs
    const guestIds = Array.from(new Set(reservations.map((r: any) => r.GuestID).filter((id: any) => id)));

    if (guestIds.length === 0) {
      return reservations;
    }

    try {
      // Fetch guest data for all unique guest IDs
      const guestRes = await axios.post('/api/Guest/List', {
        GuestID: 0,
        GuestName: "",
        CountryID: "0",
        IdentityValue: "",
        Phone: "",
        TransactionID: "",
        IsMainOnly: false
      });
      const guests = guestRes.data.JsonData;

      // Create a map of guest data by GuestID
      const guestMap = new Map();
      guests.forEach((guest: any) => {
        guestMap.set(guest.GuestID, guest);
      });

      // Enhance reservation data with guest contact information
      const enhancedReservations = reservations.map((reservation: any) => {
        const guest = guestMap.get(reservation.GuestID);
        return {
          ...reservation,
          GuestPhone: guest?.Phone || guest?.Mobile || guest?.PhoneOrMobile || "",
          GuestEmail: guest?.Email || "",
          Phone: guest?.Phone || "",
          Mobile: guest?.Mobile || "",
          Email: guest?.Email || ""
        };
      });

      return enhancedReservations;
    } catch (error) {
      console.error('Error fetching guest data:', error);
      // Return original data if guest fetch fails
      return reservations;
    }
  };

  return useSWR(listUrl, fetcher);
};

export const ReservationGroupRoomTypeSWR = (id: any) => {
  const fetcher = async (url: any) =>
    await axios
      .post(url, { GroupID: id })
      .then((res: any) => res.data.JsonData);

  return useSWR(`${urlPrefix}/Group/RoomTypes`, fetcher);
};

export const ReservationGroupRoomSWR = (id: any) => {
  const fetcher = async (url: any) =>
    await axios
      .post(url, { GroupID: id })
      .then((res: any) => res.data.JsonData);

  return useSWR(`${urlPrefix}/Group/Rooms`, fetcher);
};

export const ReservationLogSWR = (id: any, groupID: any) => {
  const fetcher = async (url: any) =>
    await axios
      .post(url, { TransactionID: id, GroupID: groupID })
      .then((res: any) => res.data.JsonData);

  return useSWR(`${urlPrefix}/Log`, fetcher);
};

export const DepartureSWR = (values: any) => {
  const searchParams = values || {
    StartDate: new Date().toISOString().split('T')[0],
    EndDate: new Date().toISOString().split('T')[0],
    GroupID: 0,
    GroupInReserv: false,
    GroupInHouse: false,
    GroupDeparted: false,
    GroupCode: ""
  };

  const fetcher = async (url: any) =>
    await axios
      .get(`${urlPrefix}/DepartureList`, { params: searchParams })
      .then((res: any) => res.data.JsonData);

  return useSWR([`${urlPrefix}/DepartureList`, searchParams], fetcher);
};

export const DepartedListSWR = (values?: any) => {
  const fetcher = async (url: any) =>
    await axios
      .get(`${urlPrefix}/DepartedList`)
      .then((res: any) => res.data.JsonData);

  return useSWR(`${urlPrefix}/DepartedList`, fetcher);
};

export const GroupReservationSWR = (search: any) => {
  if (!search) {
    return { data: undefined, error: undefined };
  }
  
  const fetcher = async (url: any) => {
    // First, get the group list
    const groupListRes = await axios.post(`${urlPrefix}/GroupList`, search);
    const groupData = groupListRes.data.JsonData;

    if (!groupData || groupData.length === 0) {
      return groupData;
    }

    // Extract unique GroupIDs and TransactionIDs
    const transactionRequests = groupData.map((item: any) => ({
      GroupID: item.GroupID,
      TransactionID: item.TransactionID
    })).filter((item: any) => item.GroupID && item.TransactionID);

    if (transactionRequests.length === 0) {
      return groupData;
    }

    try {
      // Fetch detailed transaction info for each item
      const transactionInfoPromises = transactionRequests.map((req: any) =>
        axios.post('/api/FrontOffice/TransactionInfo', {
          GroupID: req.GroupID,
          TransactionID: req.TransactionID
        })
      );

      const transactionInfoResults = await Promise.all(transactionInfoPromises);

      // Create a map of transaction info by TransactionID
      const transactionInfoMap = new Map();
      transactionInfoResults.forEach((result: any, index: number) => {
        const transactionID = transactionRequests[index].TransactionID;
        transactionInfoMap.set(transactionID, result.data.JsonData);
      });

      // Enhance group data with transaction info
      const enhancedData = groupData.map((item: any) => {
        const transactionInfo = transactionInfoMap.get(item.TransactionID);
        return {
          ...item,
          ...transactionInfo
        };
      });

      return enhancedData;
    } catch (error) {
      console.error('Error fetching transaction info:', error);
      // Return original data if transaction info fetch fails
      return groupData;
    }
  };

  return useSWR([`${urlPrefix}/GroupList`, search], fetcher);
};

export const InHouseListSWR = (search: any) => {
  const fetcher = async (url: any) =>
    await axios
      .post(`${urlPrefix}/GroupList`, search)
      .then((res: any) => res.data.JsonData);

  return useSWR([`${urlPrefix}/GroupList`, search], fetcher);
};

export const PendingReservationSWR = () => {
  const fetcher = async () =>
    await axios
      .get(`${urlPrefix}/PendingReservation`)
      .then((res: any) => res.data.JsonData);

  return useSWR(`${urlPrefix}/PendingReservation`, fetcher);
};

export const PendingDueOutSWR = () => {
  const fetcher = async (url: any) =>
    await axios
      .get(`${urlPrefix}/PendingDueOut`)
      .then((res: any) => res.data.JsonData);

  return useSWR(`${urlPrefix}/PendingDueOut`, fetcher);
};

export const SharerListSWR = (TransactionID: any) => {
  const fetcher = async (url: any) =>
    await axios
      .post(`${urlPrefix}/Sharer/List`, { TransactionID: TransactionID })
      .then((res: any) => res.data.JsonData);

  return useSWR(`${urlPrefix}/Sharer/List`, fetcher);
};

export const ReservationAPI = {
  groupReservation: async (search: any) => {
    const res = await axios.post(`${urlPrefix}/GroupList`, search);
    var list = res.data.JsonData;

    return list;
  },

  get: async (id: any) => {
    const values = {
      TransactionIDs: [
        {
          ID: id,
        },
      ],
    };
    const res = await axios.post(listUrl, values);
    var list = res.data.JsonData;
    var item;

    if (list.length === 1) {
      item = list[0];
    } else {
      item = null;
    }
    return item;
  },

  new: async (values: any) => {
    var vals = values;

    const { data, status } = await axios.post(`${urlPrefix}/New`, vals);
    return {
      status: values,
    };
  },
  checkIn: async (TransactionID: any) => {
    const values = {
      TransactionID: TransactionID,
    };
    const res = await axios.post(`${urlPrefix}/CheckIn`, values);
    return res;
  },
  checkOut: async (TransactionID: any) => {
    const values = {
      TransactionID: TransactionID,
    };
    const res = await axios.post(`${urlPrefix}/CheckOut`, values);
    return res;
  },
  amendStay: async (values: any) => {
    const res = await axios.post(`${urlPrefix}/AmendStay`, values);
    return res;
  },
  groupAmendStay: async (values: any) => {
    const res = await axios.post(`${urlPrefix}/GroupAmendStay`, values);
    return res;
  },
  cancel: async (values: any) => {
    const res = await axios.post(`${urlPrefix}/Cancel`, values);
    return res;
  },
  noShow: async (values: any) => {
    const res = await axios.post(`${urlPrefix}/NoShow`, values);
    return res;
  },
  void: async (values: any) => {
    const res = await axios.post(`${urlPrefix}/Void`, values);
    return res;
  },
  roomAssign: async (values: any) => {
    const res = await axios.post(`${urlPrefix}/RoomAssign`, values);
    return res;
  },
  roomUnassign: async (TransactionID: any) => {
    const values = {
      TransactionID: TransactionID,
    };
    const res = await axios.post(`${urlPrefix}/RoomUnassign`, values);
    return res;
  },
  roomMove: async (values: any) => {
    const res = await axios.post(`${urlPrefix}/RoomMove`, values);
    return res;
  },
  updateReservationType: async (TransactionID: any) => {
    const values = {
      TransactionID: TransactionID,
    };
    const res = await axios.post(
      `${urlPrefix}/UpdateReservationType`,
      values
    );
  },

  groupList: async (id: any) => {
    const values = {
      GroupID: id,
    };
    const res = await axios.post(`${urlPrefix}/GroupList`, values);

    var list = res.data.JsonData;
    var item;

    if (list.length === 1) {
      item = list[0];
    } else {
      item = null;
    }
    return item;
  },

  guestReplace: async (values: any) => {
    var vals = values;

    const { data, status } = await axios.post(
      `${urlPrefix}/UpdateGuest`,
      values
    );
    return {
      status: values,
    };
  },

  customerReplace: async (values: any) => {
    var vals = values;

    const { data, status } = await axios.post(
      `${urlPrefix}/UpdateCustomer`,
      values
    );
    return {
      status: values,
    };
  },
};
