import { IncomingMessage, ServerResponse } from 'node:http';

export const getUsers = async (req: IncomingMessage, res: ServerResponse) => {};

export const getUser = async (req: IncomingMessage, res: ServerResponse, userId: string) => {};

export const createUser = async (req: IncomingMessage, res: ServerResponse) => {};

export const updateUser = async (req: IncomingMessage, res: ServerResponse, userId: string) => {};

export const deleteUser = async (req: IncomingMessage, res: ServerResponse, userId: string) => {};
