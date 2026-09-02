import {config} from "dotenv";

config({path: ".env.local"});
config({path: ".env", override: true});

import {runLifecycleTick} from "../lifecycle-jobs";

runLifecycleTick()
    .then((result) => {
        console.log(
            `Lifecycle tick complete. reminders=${result.reminders} locked=${result.lockedContracts} complaintsRevealed=${result.visibleComplaints}`,
        );
        process.exit(0);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
