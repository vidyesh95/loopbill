import {getServices} from "@/lib/db/queries";
import ServicesClient from "./services-client";

export default async function Services() {
    const services = await getServices();
    return <ServicesClient services={services}/>;
}
