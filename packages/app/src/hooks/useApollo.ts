import { initializeApollo } from "@/lib/Apollo/setup"
import { useMemo } from "react"

export function useApollo(initialState: any) {
  const store = useMemo(() => initializeApollo(initialState), [initialState])
  return store
}