export interface UserResponse {
    user_id: string;
    subscription: {
        character_count: number;
        character_limit: number;
    };
}
