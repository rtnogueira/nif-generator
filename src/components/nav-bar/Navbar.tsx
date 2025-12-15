import React from 'react'
import AssignmentInd from '@mui/icons-material/AssignmentInd'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import MenuIcon from '@mui/icons-material/Menu'
import { useTheme } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import useDrawerStore from '../../shared/state/drawer-store'

const Navbar: React.FC = () => {
  const { width, open, openDrawer, closeDrawer } = useDrawerStore()
  const theme = useTheme()

  function handleDrawerOpen() {
    openDrawer()
  }

  function handleDrawerClose() {
    closeDrawer()
  }

  return (
    <>
      <AppBar
        sx={{
          position: 'fixed',
          top: 0,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            width: `calc(100% - ${width}px)`,
            marginLeft: `${width}px`,
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: theme.spacing(2),
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Generator of Things
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: width,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: width,
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 8px',
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
          }}
        >
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>
        <Divider />
        <List>
          <ListItem key="NIF">
            <ListItemButton>
              <ListItemIcon>
                <AssignmentInd />
              </ListItemIcon>
              <ListItemText primary="NIF" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  )
}

export default Navbar
