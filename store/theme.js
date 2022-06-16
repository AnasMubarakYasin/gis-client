import { createSlice } from '@reduxjs/toolkit'

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    value: 'dark',
  },
  reducers: {
    dark: (state) => {
      state.value = 'dark'
    },
    light: (state) => {
      state.value = 'light'
    },
  },
})

export default themeSlice.reducer
export const { dark, light } = themeSlice.actions
