export function useEnv() {
  const { VITE_BASE_API, MODE } = import.meta.env
  return {
    MODE,
    VITE_BASE_API,
  }
}
