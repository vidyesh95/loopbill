import {getContracts} from "@/lib/db/queries";
import {getLookups} from "@/lib/db/queries-staff";
import ContractsClient from "./contracts-client";

export default async function Contracts() {
    const [contracts, lookups] = await Promise.all([getContracts(), getLookups()]);
    return <ContractsClient contracts={contracts} customers={lookups.customers} packages={lookups.packages} />;
}
