export class LikeModel {
    likeKey: string;
}

export class ComModel {
    userKey: string;
    text: string;
    timestamp: any;
}

export class PostModel {
    text: string;
    date: string;
    timestamp: any;
    photos?: string[];
}

