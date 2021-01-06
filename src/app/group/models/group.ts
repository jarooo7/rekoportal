import { AvatarModel } from '../../user/models/profile.model';

export class GroupModel {
    name: string;
    description: string;
    admins: string[];
    key?: string;
    search?: string;
    armies: string[];
    otherArmies: string[];
    avatar?: AvatarModel;
}
export class KeyGroupnModel {
    id: string;
}

export class SubModel {
    read: boolean;
    idArticle:  string;
    timestamp: any;
    groupId: string;
}
