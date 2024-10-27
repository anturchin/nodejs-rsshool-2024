export interface Coordinate {
    x: number;
    y: number;
}

export enum CellState {
    Empty = 'empty',
    Ship = 'ship',
    Hit = 'hit',
    Miss = 'miss',
}

export type GameBoard = CellState[][];

export type ShipType = 'small' | 'medium' | 'large' | 'huge';

export interface Ship {
    id: string;
    type: ShipType;
    length: number;
    position: Coordinate;
    direction: boolean;
    hitPositions: Coordinate[];
}

export interface Player {
    id: string;
    name: string;
    password: string;
    wins: number;
}

export interface Room {
    id: string;
    players: Player[];
    gameBoard: GameBoard;
    ships: Ship[];
    turnIndex: number;
}

export interface GameState {
    players: Map<string, Player>;
    rooms: Map<string, Room>;
    winnerTable: Player[];
}

export interface Message {
    type:
        | 'reg'
        | 'update_winners'
        | 'create_room'
        | 'add_user_to_room'
        | 'create_game'
        | 'update_room'
        | 'add_ships'
        | 'start_game'
        | 'attack'
        | 'randomAttack'
        | 'turn'
        | 'finish'
        | 'single_play';
    data: string;
}

export type PlayerResResponse = {
    type: 'reg';
    data: string;
    id: number;
};

export type PlayerReqResponse = {
    name: string;
    password: string;
};

export type UserToRoom = {
    indexRoom: string;
};
