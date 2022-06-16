import { createSlice } from '@reduxjs/toolkit'

const example = [
  {
    name: "Anas",
    image: "/proto-512.v2.svg",
    job: "Full-Stack Developer",
    email: "bladerlaiga.97@gmail.com"
  },
  {
    name: "Mubarak",
    image: "/proto-512.v2.svg",
    job: "Front-End Developer",
    email: "bladerlaiga.97@gmail.com"
  },
  {
    name: "Yasin",
    image: "/proto-512.v2.svg",
    job: "Back-End Developer",
    email: "bladerlaiga.97@gmail.com"
  },
]

export const teamSlice = createSlice({
  name: 'team',
  initialState: {
    value: [...example],
    removed: [],
    selected: []
  },
  reducers: {
    get: (state, { payload }) => {

    },
    add: (state, { payload }) => {
      state.value.push(payload)
    },
    patch: (state) => {

    },
    del: (state) => {
      state.selected = state.selected.sort()
      state.value = state.value.reduce((prev, curr, index) => {
        if (state.selected.length) {
          if (index !== state.selected[0]) {
            prev.push(curr)
          } else {
            state.selected.shift()
          }
        } else {
          prev.push(curr)
        }
        return prev
      }, [])
    },
    select: (state, { payload }) => {
      state.selected.push(payload)
    },
    unselect: (state, { payload }) => {
      state.selected.splice(state.selected.indexOf(payload), 1)
    },
    reselect: (state) => {
      state.selected = []
    }
  },
})

export default teamSlice.reducer
export const { add, get, del, patch, select, unselect, reselect } = teamSlice.actions
