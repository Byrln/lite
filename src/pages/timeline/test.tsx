import Timeline from "react-calendar-timeline";
import {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
} from "react-calendar-timeline";
// make sure you include the timeline stylesheet or the timeline will not be styled
import "react-calendar-timeline/lib/Timeline.css";
import moment from "moment";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

let groups = [
  { id: 1, title: "group 1" },
  { id: 2, title: "group 2" },
];

const items = [
  {
    id: 1,
    group: 1,
    title: "item 1",
    description: "ble ble ble",
    start_time: moment(),
    end_time: moment().add(1, "hour"),
  },
  {
    id: 2,
    group: 2,
    title: "item 2",
    description: "ble ble ble",
    start_time: moment().add(-0.5, "hour"),
    end_time: moment().add(0.5, "hour"),
  },
  {
    id: 3,
    group: 1,
    title: "item 3",
    description: "ble ble ble",
    start_time: moment().add(2, "hour"),
    end_time: moment().add(3, "hour"),
  },
];

const pushGroup = () => {
  let id = groups.length + 1;
  groups.push({ id: id, title: "group " + id });
};

const onItemClick = (event: any) => {
  console.log("================= Item click ==================");
  console.log(event);
};

const onCanvasClick = (groupId: any, time: any, e: any) => {
  console.log("======= onCanvasClick ========");
};

const renderGroup = ({ group }: any) => {
  return (
    <div className="custom-group">
      <span>GR:</span>
      <span className="title">{group.title}</span>
      <KeyboardArrowDownOutlinedIcon
        onClick={() => {
          console.log(group);
          console.log("============= Collapse icon Click================");
        }}
      />
      <p className="tip">{group.tip}</p>
    </div>
  );
};

const renderItem = ({
  item,
  itemContext,
  getItemProps,
  getResizeProps,
}: any) => {
  const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
  return (
    <div {...getItemProps(item.itemProps)}>
      {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : ""}

      <div
        className="rct-item-content"
        style={{ maxHeight: `${itemContext.dimensions.height}` }}
        onClick={() => {
          console.log(item);
        }}
        title={item.description}
      >
        <div>{item.title}</div>
        <div>{item.description}</div>
      </div>

      {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : ""}
    </div>
  );
};

const TimelineTest = () => {
  return (
    <>
      <h4>Hello</h4>

      <div id={"root"}>
        <Timeline
          groups={groups}
          items={items}
          defaultTimeStart={moment().add(-12, "hour")}
          defaultTimeEnd={moment().add(12, "hour")}
          groupRenderer={renderGroup}
          itemRenderer={renderItem}
          onCanvasClick={onCanvasClick}
          itemHeightRatio={0.8}
        >
          <TimelineHeaders
            className={"timeline_header"}
            calendarHeaderClassName={"calendar_header"}
          >
            <SidebarHeader>
              {({ getRootProps }) => {
                return (
                  <div {...getRootProps()} className={"sidebar_header"}>
                    asdf
                  </div>
                );
              }}
            </SidebarHeader>
            <DateHeader unit="primaryHeader" className={"date_header"} />
            <DateHeader />
          </TimelineHeaders>
        </Timeline>
      </div>

      <button onClick={pushGroup}>Push group</button>
    </>
  );
};

export default TimelineTest;
