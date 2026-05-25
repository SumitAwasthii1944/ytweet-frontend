import { useSelector, type TypedUseSelectorHook } from "react-redux"
import { type RootState } from "../app/store.ts"

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default useAppSelector