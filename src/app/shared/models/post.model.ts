export class PhotoModel {
    url: string;
}

export class PostModel {
    text: string;
    date: Date;
    photos: PhotoModel[];
}

