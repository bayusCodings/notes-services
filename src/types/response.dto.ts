type Nullable<T> = T | null;

export interface ApiResponseDto<T> {
  data?: Nullable<T>;
  message?: string;
}

export function asApiResponse<T>(
  data?: T,
  message: string = 'success',
): ApiResponseDto<T> {
  return {
    data: data ?? null,
    message,
  };
}