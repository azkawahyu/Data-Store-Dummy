export function getUser(request: Request) {
  return {
    userId: request.headers.get("x-user-id"),
    role: request.headers.get("x-user-role"),
  };
}
