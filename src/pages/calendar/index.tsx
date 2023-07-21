    import {GetServerSideProps} from "next";
    import {withAuthServerSideProps} from "lib/utils/with-auth-server-side-props";
    import {FrontOfficeAPI} from "lib/api/front-office";
    import { ReactGrid, Row } from "@silevis/reactgrid";
    import { LiquidityPlanner } from "components/calendar/LiquidityPlanner";

    const TimelineList = ({props, workingDate}: any) => {
        return (
            <>
                <h4>Календар</h4>
                <br/>
                <LiquidityPlanner startDate={new Date()} dayCount={30}/>
            </>
        );
    };

    export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(
        async ({query: {id, curriculumMappingId}}) => {
            const workingDate = await FrontOfficeAPI.workingDate();
            return {
                props: {
                    workingDate: workingDate.workingDate[0].WorkingDate,
                },
            };
        }
    );

    export default TimelineList;
