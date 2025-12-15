import React, { useEffect } from 'react'
import ReactGA from 'react-ga'
import './App.css'
import { createTheme, Grid } from '@mui/material'
import { ThemeProvider as MuiThemeProvider } from '@mui/material'
import { Outlet, useLocation } from '@tanstack/react-router'
import { Footer } from './components/footer'
import { NavBar } from './components/nav-bar'
import themeFile from './util/theme'

const theme = createTheme(themeFile)

ReactGA.initialize('UA-146599861-1')

const App: React.FC = () => {
  const location = useLocation()

  useEffect(() => {
    ReactGA.set({ page: location.pathname })
    ReactGA.pageview(location.pathname)
  }, [location.pathname])

  return (
    <MuiThemeProvider theme={theme}>
      <NavBar />

      <Grid container pb={26}>
        <Outlet />
      </Grid>

      <Footer />
    </MuiThemeProvider>
  )
}

export default App
