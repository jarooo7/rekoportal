export class LikeModel {
    likeKey: string;
}

export class ComModel {
    key?: string;
    userKey: string;
    text: string;
    timestamp: any;
}

export class PostModel {
    text: string;
    date: string;
    userId: string;
    timestamp: any;
    photos?: string[];
}

