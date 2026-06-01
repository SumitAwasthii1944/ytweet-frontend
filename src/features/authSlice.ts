import { createSlice, createAsyncThunk,type PayloadAction } from "@reduxjs/toolkit"
import { loginUser, logoutUser, getCurrentUser } from "../api/user.api"
import { googleAuth } from "../api/user.api"
import type { User, LoginInput } from "../types"

interface AuthState{
          user:User | null
          isLoggedIn: boolean
          loading:boolean
          error: string | null
}

const initialState: AuthState = {
          user:null,
          isLoggedIn:false,
          loading:false,
          error:null
}

//async thunks

export const login = createAsyncThunk(
          "users/login",
          async (data: LoginInput, {rejectWithValue}) => {
                    try{
                              const res = await loginUser(data)
                              return res.data // { user, accessToken, refreshToken }
                    }catch(err:any){
                              return rejectWithValue(
                                        err.response?.data?.message || " login failed!"
                              )
                    }
          }
)

export const logout = createAsyncThunk(
          "users/logout",
          async (_,{rejectWithValue}) => {
                    try{
                              const res = await logoutUser();
                              return res.data
                    }catch(err:any){
                              return rejectWithValue(
                                        err.response?.data?.message || "logout failed"
                              )
                    }
          }
)

export const fetchCurrentUser = createAsyncThunk(
          "users/current-user",
          async (_,{rejectWithValue}) => {
                    try{
                              const res = await getCurrentUser()
                              return res.data//user object
                    }catch(err:any){
                              return rejectWithValue(
                                        err.response?.data?.message || "fetching current user failed"
                              )
                    }
          }
)

export const googleLogin = createAsyncThunk(
    "users/google-login",
    async (idToken: string, { rejectWithValue }) => {
        try {
            const res = await googleAuth(idToken)
            return res.data
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Google login failed")
        }
    }
)

//create slice

const authSlice = createSlice({
          name:"auth",
          initialState,
          reducers:{
                    setUser:(state,action:PayloadAction<User>) => {
                              state.user=action.payload
                              state.isLoggedIn=true
                    },
                    clearUser:(state) => {
                              state.user=null
                              state.isLoggedIn=false
                    },
                    clearError:(state) => {
                              state.error=null
                    }
          },
          extraReducers:(builder) => {
                    //login
                    builder.addCase(login.pending,(state) => {
                              state.loading=true
                              state.error=null
                    })
                    builder.addCase(login.fulfilled,(state,action) => {
                              state.loading=false
                              state.user=action.payload.user
                              state.isLoggedIn = true
                              state.error=null
                    })   
                    builder.addCase(login.rejected,(state,action) => {
                              state.loading=false
                              state.error=action.payload as string
                    })    

                    // google login
                    // The googleLogin thunk re-uses the existing auth response shape
                    // so reducers can handle it exactly like regular `login`.
                    builder.addCase(googleLogin.pending,(state) => {
                              state.loading=true
                              state.error=null
                    })
                    builder.addCase(googleLogin.fulfilled,(state,action) => {
                              state.loading=false
                              // payload contains { user, accessToken, refreshToken }
                              state.user=action.payload.user
                              state.isLoggedIn = true
                              state.error=null
                    })
                    builder.addCase(googleLogin.rejected,(state,action) => {
                              state.loading=false
                              state.error=action.payload as string
                    })

                    //logout
                    builder.addCase(logout.pending,(state) => {
                              state.loading=true
                              state.error=null
                    })
                    builder.addCase(logout.fulfilled,(state) => {
                              state.loading=false
                              state.user=null
                              state.isLoggedIn=false
                    })
                    builder.addCase(logout.rejected,(state,action) => {
                              state.loading=false
                              state.error=action.payload as string
                    })

                    //fetchcurrentuser
                    builder.addCase(fetchCurrentUser.pending,(state) => {
                              state.loading=true
                              state.error=null
                    })
                    builder.addCase(fetchCurrentUser.fulfilled,(state,action) => {
                              state.loading=false
                              state.user=action.payload // not used .user because it directly returns user object
                              state.isLoggedIn=true
                    })
                    builder.addCase(fetchCurrentUser.rejected,(state) => {
                              state.loading = false
                              state.user=null
                              state.isLoggedIn=false
                              //no error set — because rejection is EXPECTED , no need to show error just redirect to login page
                    })
          }

})

export const { setUser, clearUser, clearError } = authSlice.actions
export default authSlice.reducer