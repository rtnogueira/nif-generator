import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface DrawerState {
  width: number
  open: boolean
}

interface DrawerStore extends DrawerState {
  openDrawer: () => void
  closeDrawer: () => void
}

const useDrawerStore = create<DrawerStore>()(
  devtools(
    set => ({
      width: 240,
      open: false,
      openDrawer: () => set({ open: true }, false, 'drawer/open'),
      closeDrawer: () => set({ open: false }, false, 'drawer/close'),
    }),
    { name: 'DrawerStore' }
  )
)

export default useDrawerStore
