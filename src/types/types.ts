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

export type PlayerId =  'player_1' | 'player_2' | 'player_3' | 'player_4'
export type Suit = 'locals' | 'nobles' | 'travelers' | 'money'
export type Product = 'cerveza' | 'comida' | 'fuego' | 'juegos' | 'musica' | 'sofa' | 'te' | 'torta' | 'whisky'
export type State = 'in_deck' | 'in_table' | 'in_hand' | 'in_discard_pile'


export interface PlayingCard {
    id: number,
    product: Product,
    suit: Suit,
    image_url: string,
    owner: PlayerId | null,
    state: State 
};

export interface RoomCard {
    id: number,
    image_url: string,
    quality: number,
    owner: PlayerId | null,
    state: State,
    guest: GuestCard | null,
};

export interface GuestCard {
    id: number,
    name: string,
    used_nights: number,
    total_nights: number,
    product: Product,
    suit: Suit,
    image_url: string,
    owner: PlayerId | null,
    state: State,
}

export type AvailablePlayer = typeof AVAILABLE_PLAYERS[number];
export type PlayerColor = AvailablePlayer['color'];

export interface Player {
    player_id: PlayerId,
    avatar: string,
    color: PlayerColor,
    name: string,
    hand: PlayingCard[],
    rooms: RoomCard[],
    score: PlayerScore,
}

export interface Turn {
    id: number,
    number: number,
    player_id_turn: PlayerId,
    current_guest: GuestCard | null,
};

export interface PlayerState {
    player: PlayerId,
    is_my_turn: boolean,
    hand: PlayingCard[],
    played_cards_in_turn: PlayingCard[],
    turn: Turn,
    state: 'in_progress' | 'finished'
}

export interface Event {
    id: number,
    initial: string,
    name: string,
    requirements: Product[],
    completed: boolean,
}

export interface PlayersInGame {
    players: PlayerId[],
    player_turn: PlayerId,
}

export interface PlayerScore {
    former_guests: GuestCard[]
    events: Event[],
    money: number,
}


