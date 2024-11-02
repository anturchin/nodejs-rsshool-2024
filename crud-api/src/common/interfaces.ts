import { User } from '../models/user.model';

export interface UpdateUsersMessage {
    type: 'updateUsers';
    users: User[];
}
