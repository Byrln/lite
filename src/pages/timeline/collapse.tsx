import CustomTimeline from "../../components/timeline/custom";
import "react-calendar-timeline/lib/Timeline.css";

const RenderClick = () => {
  alert("Hello");
};

const TimelineList = (props: any) => {
  return (
    <>
      <h4>Timeline test</h4>
      <CustomTimeline />
    </>
  );
};

export default TimelineList;
