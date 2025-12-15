import React, { useState } from 'react'
import { Grid } from '@mui/material'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import { CopyToClipboard } from '../../components/copy-to-clipboard'
import { ExportCSV } from '../../components/export-csv'
import nifTypes from '../../constants/nifTypes'
import Logo from '../../images/logo.png'
import { generateNif } from '../../util/nif'

interface InputValues {
  quantity: number
  type: number
}

const NifGenerator: React.FC = () => {
  const [inputValues, setInputValues] = useState<InputValues>({
    quantity: 1,
    type: 2,
  })

  const [nifList, setNifList] = useState<string[]>([])

  function handleChange(event: SelectChangeEvent<number>) {
    const { name, value } = event.target
    setInputValues(oldValues => ({
      ...oldValues,
      [name as string]: value,
    }))
  }

  function generateNifList() {
    const newNifList: string[] = []

    for (let i = 0; i < inputValues.quantity; i++) {
      const randomNif = generateNif(inputValues.type)

      newNifList.push(randomNif)
    }

    setNifList(newNifList)
  }

  return (
    <Grid
      container
      width="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      rowGap={4}
      pt={10}
      px={4}
    >
      <Grid container alignItems="center" columnGap={3}>
        <img src={Logo} alt="app icon" width="60px" />

        <Typography
          variant="h1"
          sx={{
            fontSize: '24px',
          }}
        >
          NIF Generator
        </Typography>
      </Grid>

      <Grid container width="100%" columns={12} columnSpacing={2} rowSpacing={4}>
        <Grid container flexDirection="column" rowGap={4} size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel htmlFor="type">Type</InputLabel>

            <Select
              value={inputValues.type}
              onChange={handleChange}
              input={<Input name="type" id="type" />}
            >
              {nifTypes.map(nif => (
                <MenuItem key={nif.value} value={parseInt(nif.value, 10)}>
                  {`${nif.name} [${nif.value}]`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel htmlFor="quantity">Quantity</InputLabel>
            <Select
              value={inputValues.quantity}
              onChange={handleChange}
              input={<Input name="quantity" id="quantity" />}
            >
              {[...Array(50)].map((_e, i) => {
                i++
                return (
                  <MenuItem key={i} value={i}>
                    {i}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>

          <Button
            size="large"
            fullWidth
            variant="contained"
            color="primary"
            onClick={generateNifList}
          >
            Generate
          </Button>
        </Grid>

        <Grid container flexDirection="column" size={{ xs: 12, md: 6 }}>
          {nifList && nifList.length > 0 ? (
            <ExportCSV csvData={nifList} fileName="nif-list" />
          ) : null}
          <List>
            {nifList.map(nif => (
              <ListItem key={nif} secondaryAction={<CopyToClipboard value={nif} />}>
                <ListItemText
                  primary={nif}
                  sx={{
                    marginRight: '20px',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default NifGenerator
