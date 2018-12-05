export class ProfileModel {
    name: string;
    lastName: string;
    dateBirth: string;
    search?: string;
}

export class UserId {
    userId: string;
}

export class AvatarModel {
    url: string;
    location: string;
}

export class UserModel {
    name: string;
    lastName: string;
    dateBirth: string;
    avatar?: AvatarModel;
}

