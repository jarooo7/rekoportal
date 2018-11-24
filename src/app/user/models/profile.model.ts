export class ProfileModel {
    name: string;
    lastName: string;
    dateBirth: string;
}

export class AvatarModel {
    url: string;
    date: Date;
}

export class UserModel {
    name: string;
    lastName: string;
    dateBirth: string;
    avatar: AvatarModel;
}

