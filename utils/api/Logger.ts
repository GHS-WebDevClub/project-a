/** 
 * Handles logging of API requests
 * Created by Aubin Spitzer (@aubincspitzer) - 02/09/2022
 * 
 * TODO: Persistent centralized logging system.
*/

import { v4 as uuidv4 } from 'uuid'; 
import { DateTime } from "luxon";

/**
 * INFO - Low-level for tracking of incoming requests and debugging
 * MIN - Minor low-level bugs that need to be investigated
 * MAJ - Major mid-level errors/bugs that interrupt user-usability, or system function; Primary systems are able to continue functioning.
 * CRIT - A CRITICAL error has occurred that prevents the system (or parts of it) from operating. Maintenance needed immediately.
 */
type PriorityType = "INFO" | "MIN" | "MAJ" | "CRIT";

export class ApiMsg {
    priority?: PriorityType;
    route?: string;
    message: string;
    uuid: string;
    millis: number;

    constructor(message: string, priority?: PriorityType, route?: string) {
        this.priority = priority || "INFO";
        this.route = route;
        this.message = message;
        this.uuid = uuidv4();
        this.millis = DateTime.now().toMillis();
    }
}

export default function apiLogger (msg: string | ApiMsg, priority?: PriorityType) {
    let logOutput: ApiMsg;

    if(typeof msg === "string") logOutput = new ApiMsg(msg, priority);
    else logOutput = msg;

    /** Log to console */
    console.log(`[${logOutput.priority}] [${logOutput.uuid}] ${logOutput.message}`)
    /** Log to xxx (TODO) */

    return logOutput;
}