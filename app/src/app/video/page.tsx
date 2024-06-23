import { fetchAccessToken } from "@humeai/voice";
import VideoPage from "./video";

export default async function Page() {

  const accessToken = await fetchAccessToken({
    apiKey: String(process.env.HUME_API_KEY),
    secretKey: String(process.env.HUME_SECRET_KEY),
});

console.log(accessToken);

    return (
        <VideoPage accessToken={accessToken}/>
    )
}