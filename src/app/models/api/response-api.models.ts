export interface ResponseAPI<T> {
    success: boolean;
    statusCode: string;
    message: any;
    data: T;
}