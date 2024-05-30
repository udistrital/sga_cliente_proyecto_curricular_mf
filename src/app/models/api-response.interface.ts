export interface ApiResponse <T, M = any> {
    Success: boolean;
    Status: boolean;
    Message: M;
    Data: T;
}