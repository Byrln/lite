import moment from "moment";

const groups = [
  {
    id: "1",
    title: "Lux room",
    parent: null,
    hasChild: true,
    isSaleItem: false,
    nestLevel: 0,
  },
  {
    id: "1_1",
    title: "Room 101",
    parent: "1",
    hasChild: false,
    isSaleItem: false,
    nestLevel: 1,
  },
  {
    id: "1_2",
    title: "Room 102",
    parent: "1",
    hasChild: false,
    isSaleItem: false,
    nestLevel: 1,
  },
  {
    id: "2",
    title: "Vip room",
    parent: null,
    hasChild: true,
    isSaleItem: false,
    nestLevel: 0,
  },
  {
    id: "2_1",
    title: "Room 201",
    parent: "2",
    hasChild: false,
    isSaleItem: true,
    nestLevel: 1,
  },
  {
    id: "2_2",
    title: "Room 202",
    parent: "2",
    hasChild: false,
    isSaleItem: true,
    nestLevel: 1,
  },
  {
    id: "2_3",
    title: "Room 203",
    parent: "2",
    hasChild: true,
    isSaleItem: true,
    nestLevel: 1,
  },
  {
    id: "2_3_1",
    title: "Bed 203-1",
    parent: "2_3",
    hasChild: false,
    isSaleItem: true,
    nestLevel: 2,
  },
];

const items = [
  {
    id: 1,
    group: "1_1",
    title: "item 1",
    description: "ble ble ble",
    start_time: moment(),
    end_time: moment().add(1, "hour"),
  },
  {
    id: 2,
    group: "2_2",
    title: "item 2",
    description: "ble ble ble",
    start_time: moment().add(-0.5, "hour"),
    end_time: moment().add(0.5, "hour"),
  },
  {
    id: 3,
    group: "1_1",
    title: "item 3",
    description: "ble ble ble",
    start_time: moment().add(2, "hour"),
    end_time: moment().add(3, "hour"),
  },
];

export { items, groups };
