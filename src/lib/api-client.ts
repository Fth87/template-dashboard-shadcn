const API_ERROR_NAME = "ApiError"

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = API_ERROR_NAME
    this.status = status
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown
}

function extractErrorMessage(payload: unknown, status: number): string {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message
  }

  return `Request gagal dengan status ${status}.`
}

export async function apiFetch<TResponse>(
  url: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const { body, headers, ...rest } = options

  let response: Response
  try {
    response = await fetch(url, {
      ...rest,
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError("Tidak dapat terhubung ke server.", 0)
  }

  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(payload, response.status), response.status)
  }

  return payload as TResponse
}
