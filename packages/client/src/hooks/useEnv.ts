export function useEnv() {
  const env = import.meta.env
  return env
  const { VITE_BASE_URL, VITE_API_URL, MODE } = env
  return {
    MODE,
    VITE_BASE_URL,
    VITE_API_URL,
  }
}
