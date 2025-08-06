import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "lib/utils/with-auth-server-side-props";

import TimelinePms from "../../components/timeline/pms";
import "react-calendar-timeline/lib/Timeline.css";

import { FrontOfficeAPI } from "lib/api/front-office";

const TimelineList = ({ props, workingDate }: any) => {
  return (
    <>
      <h4>Хянах самбар</h4>
      <TimelinePms workingDate={workingDate} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(
  async ({ query: { id, curriculumMappingId } }) => {
    const workingDate = await FrontOfficeAPI.workingDate();
    return {
      props: {
        workingDate: workingDate.workingDate[0].WorkingDate,
      },
    };
  }
);

export default TimelineList;
