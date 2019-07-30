export function handleHttpErrors(response: Response) {
  if (!response.ok) {
    console.error(response.statusText);
    throw new Error(response.statusText);
  }
  return response;
};
