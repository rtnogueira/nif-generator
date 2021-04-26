import { generateNif } from '../../util/nif';
import { CopyToClipboard } from '../../components/copy-to-clipboard';
import { ExportCSV } from '../../components/export-csv';
import { NifGeneratorStyles } from './NifGenerator.styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Logo from '../../images/logo.png';
import nifTypes from '../../constants/nifTypes';
import React, { useState } from 'react';

const NifGenerator = (props) => {
    const { classes: styles } = props;

    const [inputValues, setInputValues] = useState({
        quantity: 1,
        type: 2,
    });

    const [nifList, setNifList] = useState([]);

    function handleChange(event) {
        setInputValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value,
        }));
    }

    function generateNifList() {
        let newNifList = [];

        for (let i=0; i < inputValues.quantity; i++) {
            const randomNif = generateNif(inputValues.type);

            newNifList.push(randomNif);
        }

        setNifList(newNifList)
    }
    
    return (
        <Grid container spacing={2} className={ styles.mainContainer }>
            <Grid item xs={12} className={ styles.header }>
                <img src={Logo} alt='app icon' className={ styles.image } />
                <Typography variant='h4' className={ styles.pageTitle }>
                    NIF Generator
                </Typography>
            </Grid>
            <Grid item xs={12} className={ styles.formContainer }>
                <FormControl className={`${styles.inputContainer} ${styles.typeContainer}`}>
                    <InputLabel htmlFor="type">
                        Type
                    </InputLabel>
                    <Select
                        value={inputValues.type}
                        onChange={handleChange}
                        className={ styles.input }
                        input={<Input name="type" id="type" />}>
                            {
                                nifTypes.map(nif => (
                                    <MenuItem key={nif.value} value={nif.value}>{`${nif.name} [${nif.value}]`}</MenuItem>
                                ))
                            }
                    </Select>
                </FormControl>
                <FormControl className={`${styles.inputContainer} ${styles.quantityContainer}`}>
                    <InputLabel htmlFor="quantity">
                        Quantity
                    </InputLabel>
                    <Select
                        value={inputValues.quantity}
                        onChange={handleChange}
                        className={ styles.input }
                        input={<Input name="quantity" id="quantity" />}>
                        {
                            [...Array(50)].map((e, i) => {
                                i++;
                                return (
                                    <MenuItem key={i} value={i}>{i}</MenuItem>
                                )
                            })
                        }
                    </Select>
                </FormControl>
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={ generateNifList }
                    className={ styles.button }>
                        Generate
                </Button>
            </Grid>
            <Grid item xs={12} className={ styles.resultContainer }>
                { nifList && nifList.length > 0 && <ExportCSV csvData={nifList} fileName='nif-list' /> }
                <List className={ `${styles.resultList}` }>
                    {
                        nifList.map((nif) => (
                            <ListItem key={ nif } >
                                <ListItemText primary={ nif } className={ `${styles.nif}` } />
                                <ListItemSecondaryAction>
                                    <CopyToClipboard value={ nif } />
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))
                    }
                </List>
            </Grid>
        </Grid>
    )
}

export default withStyles(NifGeneratorStyles)(NifGenerator);
