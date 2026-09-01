import {getComplaints} from "@/lib/db/queries";
import ComplaintsClient from "./complaints-client";

export default async function Complaints() {
    const complaints = await getComplaints();
    return <ComplaintsClient complaints={complaints}/>;
}
