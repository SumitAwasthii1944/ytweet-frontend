import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

interface ToastState{
          message:string
          type:"success" | "error" | "info" | null
}

interface UIState {
    sidebarOpen: boolean
    toast: ToastState
}

const initialState: UIState = {
    sidebarOpen: true,
    toast: {
        message: "",
        type: null,
    },
}

const uiSlice = createSlice({
          name:"ui",
          initialState,
          reducers:{
                    toggleSidebar: (state) => {
                              state.sidebarOpen= !state.sidebarOpen
                    },
                    setSidebar: (state,action: PayloadAction<boolean>) => {
                              state.sidebarOpen=action.payload
                    },
                    showToast: (state,action:PayloadAction<ToastState>) => {
                              state.toast=action.payload
                    },
                    hideToast: (state) => {
                              state.toast = { message: "", type: null }
                    }
          }
})
export const { toggleSidebar, setSidebar, showToast, hideToast } = uiSlice.actions
export default uiSlice.reducer