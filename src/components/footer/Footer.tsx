import React from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { Box, Typography, Link, Container, useTheme } from '@mui/material'

const Footer: React.FC = () => {
  const theme = useTheme()
  const currentYear = new Date().getFullYear()

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        padding: theme.spacing(4, 0),
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1000,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: theme.spacing(2),
          }}
        >
          <Typography
            variant="body2"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing(0.5),
            }}
          >
            Made with{' '}
            <FavoriteIcon
              sx={{
                fontSize: '1rem',
                verticalAlign: 'middle',
                color: '#FF813F',
              }}
            />{' '}
            by{' '}
            <Link
              href="https://github.com/rtnogueira"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: theme.palette.primary.contrastText,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              rtnogueira
            </Link>
          </Typography>

          <a href="https://www.buymeacoffee.com/rubentiagor">
            <img
              src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=rubentiagor&button_colour=5F7FFF&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00"
              alt="Buy me a coffee"
            />
          </a>

          <Typography variant="caption">
            For QA testing purposes only. Not for fraudulent use.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
