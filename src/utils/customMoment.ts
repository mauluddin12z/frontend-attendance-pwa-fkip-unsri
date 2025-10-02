import moment from "moment-timezone";
import { TIMEZONE } from "./constants";

// Set global locale and timezone
moment.locale("id");
moment.tz.setDefault(TIMEZONE);

// Export as customMoment to avoid autocomplete conflicts
const customMoment = moment;
export default customMoment;
