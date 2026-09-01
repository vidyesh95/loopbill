import {getContracts} from "@/lib/db/queries";
import ContractsClient from "./contracts-client";

export default async function Contracts() {
    const contracts = await getContracts();
    return <ContractsClient contracts={contracts}/>;
}
