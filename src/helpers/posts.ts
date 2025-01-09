
export const isMediaShare = (post: any) => !!post.media?.file;

export const isLinkShare = (post: any) => !!post.media?.external;

export const isTextShare = (post: any) => !isMediaShare(post) && !isLinkShare(post);
