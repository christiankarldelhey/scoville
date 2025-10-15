export type PlayerId =  'player_1' | 'player_2' | 'player_3' | 'player_4'
export type Suit = 'locals' | 'nobles' | 'travelers' | 'money'
export type Initial = 'J' | 'C' | 'R' | 'A' | 'T' | 'F'
export type Product = 'cerveza' | 'comida' | 'fuego' | 'juegos' | 'musica' | 'sofa' | 'te' | 'torta' | 'whisky'
export type State = 'in_deck' | 'in_table' | 'in_hand' | 'in_discard_pile'


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


// CARDS

export interface PlayingCard {
    id: number,
    product: Product,
    suit: Suit,
    first_row: string,
    second_row: string,
    image_url: string,
    is_selected: boolean,
    has_coincidence: Initial[] | null,
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
    value: Product,
    suit: Suit,
    image_url: string,
    owner: PlayerId | null,
    state: State,
}

export type AvailablePlayer = typeof AVAILABLE_PLAYERS[number];
export type PlayerColor = AvailablePlayer['color'];

// GAME

export type RoundPhase = 'game_preparation' | 'checkout' | 'guest_selection' | 'bid' | 'scoring';

export const ROUND_PHASE_ORDER: readonly RoundPhase[] = [
    'game_preparation',
    'checkout',
    'guest_selection',
    'bid',
    'scoring'
] as const;

export interface Game {
    round: number,
    roundPhaseOrder: readonly RoundPhase[],
    roundPhase: RoundPhase,
    active_players: PlayerId[],
    key_owner: PlayerId,
    player_turn: PlayerId,
    deck: PlayingCard[],
    discard_pile: PlayingCard[],
    guest_deck: GuestCard[],
    bid: GuestCard[] | null,
    table_plays: Record<PlayerId, PlayingCard[] | null>;
}


// PLAYER

export interface Player {
    player_id: PlayerId,
    avatar: string,
    color: PlayerColor,
    name: string,
    hand: PlayingCard[],
    rooms: RoomCard[],
    score: PlayerScore,
}

// export interface Turn {
//     id: number,
//     number: number,
//     player_id_turn: PlayerId,
//     current_guest: GuestCard | null,
// };

// export interface PlayerState {
//     player: PlayerId,
//     is_my_turn: boolean,
//     hand: PlayingCard[],
//     played_cards_in_turn: PlayingCard[],
//     turn: Turn,
//     state: 'in_progress' | 'finished'
// }

// export interface PlayersInGame {
//     players: PlayerId[],
//     player_turn: PlayerId,
// }



// SCORE

export interface Event {
    id: number,
    initial: Initial,
    name: string,
    requirements: Product[],
    completed: boolean,
}

export interface PlayerScore {
    former_guests: GuestCard[]
    events: Event[],
    secret_objective: {suit: Suit, product: Product[]},
    secret_score: number,
    score: number,
}


