import {NextResponse} from "next/server";
import {runLifecycleTick} from "@/lib/lifecycle-jobs";

export async function POST() {
    const result = await runLifecycleTick();
    return NextResponse.json(result);
}

export async function GET() {
    const result = await runLifecycleTick();
    return NextResponse.json(result);
}
