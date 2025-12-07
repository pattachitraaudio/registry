import { envPromise } from "@/lib/env";
import Home from "./Home";

export default async function Page() {
    const env = (await envPromise).ret;
    return <Home ELEVEN_LABS_API_URL={env.ELEVEN_LABS_API_URL} />;
}
