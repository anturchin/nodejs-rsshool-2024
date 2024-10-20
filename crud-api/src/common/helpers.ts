import { validate as uuidValidate } from 'uuid';

export const validateUUID = (id: string) => {
    return uuidValidate(id);
};
