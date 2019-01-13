export class ArticleModel {
    text: string;
    title: string;
    timestamp: any;
    photos?: string[];
    photoLoc?: string[];
    groupId: string;
    date?: string;
    key?: string;
}

export class ArticleLocationModel {
    timestamp: any;
    key?: string;
    idArticle: string;
}

export class ArticleIdModel {
    id: string;
    groupId: string;
    locId: string;
    date?: string;
    photos?: string[];
}

export class EditArticleModel {
    groupId: string;
    article: ArticleModel;
}

