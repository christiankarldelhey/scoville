
export type PlayerId = {
    player_id: 'Player_1' | 'Player_2' | 'Player_3' | 'Player_4',
}

export interface PlayingCard {
    id: number,
    value: 0 | 0.5 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
    suit: 'thai' | 'hindu' | 'chinese' | 'special',
    image_url: string,
    owner: PlayerId | null,
    state: 'in_deck' | 'in_dish_1' | 'in_dish_2' | 'in_hand' | 'in_discard_pile' 
};

export interface DishCard {
    id: number,
    name: string,
    suit: 'thai' | 'hindu' | 'chinese',
    current_spicyness: number,
    position: 1 | 2 | null,
    min_range: number,
    max_range: number,
    image_url: string,
    has_bet: 0 | 1 | 2,
    is_finished: boolean,
    owner: PlayerId | null,
    state: 'in_deck' | 'in_play' | 'in_player_collection'
}

export interface finishedDishes {
    dishes: DishCard[]
}

export const AVAILABLE_PLAYERS = [
    {
        id: 'Player_1' as const,
        color: '#FF5733' as const, // Rojo
        defaultAvatar: 'avatar1.png'
    },
    {
        id: 'Player_2' as const,
        color: '#3498DB' as const, // Azul
        defaultAvatar: 'avatar2.png'
    },
    {
        id: 'Player_3' as const,
        color: '#2ECC71' as const, // Verde
        defaultAvatar: 'avatar3.png'
    },
    {
        id: 'Player_4' as const,
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
    completed_dishes: DishCard[]
}


