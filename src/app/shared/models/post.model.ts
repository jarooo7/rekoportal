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
    key?: string;
    photos?: string[];
    photoLoc?: string[];
}

export class PostIdModel {
    id: string;
    userId: string;
    locId: string;
    date?: string;
    photos?: string[];
}

export class EditPosteModel {
    userId: string;
    post: PostModel;
}


