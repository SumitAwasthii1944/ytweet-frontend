import { useDispatch } from "react-redux"
import type { AppDispatch } from "../app/store.ts"

const useAppDispatch = () => useDispatch<AppDispatch>()
export default useAppDispatch