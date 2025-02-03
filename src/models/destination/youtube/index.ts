import { mediaShare as youtubeMediaShare } from "./mediaShare";
import { isValidCredentials } from "../../../helpers/credentials";
import { isMediaShare } from "../../../helpers/posts";

export const youtubeStrategies = [
    {
        name: "Youtube Media",
        site: "youtube",
        shouldRun: (post: any, destination: any) => isMediaShare(post) && post.targets.includes("youtube") && isValidCredentials(destination),
        run: (post: any, destination: any) => youtubeMediaShare(post, destination)
    },
];
