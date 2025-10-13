
export type PlayerId = {
    player_id: 'player_1' | 'player_2' | 'player_3' | 'player_4',
}

export interface PlayingCard {
    id: number,
    value: 'cerveza' | 'comida' | 'fuego' | 'juegos' | 'musica' | 'sofa' | 'te' | 'torta' | 'whisky',
    suit: 'local' | 'noble' | 'viajero' | 'descuento',
    image_url: string,
    owner: PlayerId | null,
    state: 'in_deck' | 'in_table' | 'in_hand' | 'in_discard_pile' 
};

export interface RoomCard {
    id: number,
    image_url: string,
    quality: number,
    owner: PlayerId | null,
    state: 'in_deck' | 'in_table' | 'in_hand' | 'in_discard_pile',
    guest: GuestCard | null,
};

export interface GuestCard {
    id: number,
    name: string,
    used_nights: number,
    total_nights: number,
    value: 'cerveza' | 'comida' | 'fuego' | 'juegos' | 'musica' | 'sofa' | 'te' | 'torta' | 'whisky',
    suit: 'local' | 'noble' | 'viajero' | 'descuento',
    image_url: string,
    owner: PlayerId | null,
    state: 'in_deck' | 'in_play' | 'in_player_collection',
}

export interface AccomadatedGuests {
    dishes: GuestCard[]
}

export const AVAILABLE_PLAYERS = [
    {
        id: 'player_1' as const,
        color: '#FF5733' as const, // Rojo
        defaultAvatar: 'avatar1.png'
    },
    {
        id: 'player_2' as const,
        color: '#3498DB' as const, // Azul
        defaultAvatar: 'avatar2.png'
    },
    {
        id: 'player_3' as const,
        color: '#2ECC71' as const, // Verde
        defaultAvatar: 'avatar3.png'
    },
    {
        id: 'player_4' as const,
        color: '#F39C12' as const, // Naranja
        defaultAvatar: 'avatar4.png'
    }
] as const;

export type AvailablePlayer = typeof AVAILABLE_PLAYERS[number];
export type PlayerColor = AvailablePlayer['color'];

export interface Player {
    player_id: PlayerId,
    avatar: string,
    color: PlayerColor,
    name: string,
    hand: PlayingCard[],
    rooms: RoomCard[],
}

export interface Turn {
    id: number,
    number: number,
    player_id_turn: PlayerId,
};

export interface PlayerState {
    player: PlayerId,
    is_my_turn: boolean,
    hand: PlayingCard[],
    played_cards_in_turn: PlayingCard[],
    turn: Turn,
    state: 'in_progress' | 'finished'
}

export interface PlayersInGame {
    players: PlayerId[],
    player_turn: PlayerId,
}

export interface PlayerScore {
    player_id: PlayerId,
    points: number,
    completed_dishes: GuestCard[]
}


