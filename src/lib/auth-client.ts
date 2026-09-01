import {inferAdditionalFields} from "better-auth/client/plugins";
import {createAuthClient} from "better-auth/react";

export {homeForRole} from "@/lib/roles";

export const authClient = createAuthClient({
    plugins: [
        inferAdditionalFields({
            user: {
                role: {type: "string"},
                phone: {type: "string"},
                department: {type: "string"},
                status: {type: "string"},
            },
        }),
    ],
});
