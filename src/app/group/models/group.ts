import { AvatarModel } from '../../user/models/profile.model';

export class GroupModel {
    name: string;
    description: string;
    admins: string[];
    key?: string;
    epochs: string[];
    otherEpochs: string[];
    avatar?: AvatarModel;
}
export class KeyGroupnModel {
    id: string;
}
