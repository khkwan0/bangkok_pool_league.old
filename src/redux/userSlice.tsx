import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'

export interface UserState {
  user: {
    id: number
    email: string
  }
}

const initialState: UserState = {
  user: {
    id: 0,
    email: '',
  },
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    SetUser: (state, action: PayloadAction<object>) => {
      state.user = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {SetUser} = userSlice.actions

export default userSlice.reducer
