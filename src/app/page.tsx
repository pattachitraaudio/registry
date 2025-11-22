import { ServiceManager } from "@/classes/xServiceManager";

import Home from "./Home";

export default async function Page() {
    const env = (await new ServiceManager().setup()).env;
    return <Home ELEVEN_LABS_API_URL={env.ELEVEN_LABS_API_URL} />;
}
