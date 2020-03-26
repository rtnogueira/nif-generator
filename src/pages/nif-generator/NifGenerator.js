import { generateNif } from '../../util/nif';
import { CopyToClipboard } from '../../components/copy-to-clipboard';
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

const styles = theme => ({
    mainContainer: {
        textAlign: 'center',
    },
    image: {
        margin: '20px auto',
        width: '100px',
    },
    pageTitle: {
        margin: '10px auto',
    },
    formContainer: {
        display: 'flex',
        justifyContent: 'center',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
        },
    },
    inputContainer: {
        textAlign: 'left',
        [theme.breakpoints.down('xs')]: {
            minWidth: '100%',
        },
    },
    typeContainer: {
        [theme.breakpoints.up('xs')]: {
            minWidth: '340px',
        },
    },
    quantityContainer: {
        [theme.breakpoints.up('xs')]: {
            margin: '0 20px',
        },
        [theme.breakpoints.down('xs')]: {
            margin: '20px 0',
        },
    },
    resultContainer: {
        display: 'flex',
        justifyContent: 'center',
        margin: '20px 0',
    },
    resultList: {     
        maxWidth: '250px',
    },
    nif: {
        marginRight: '20px',
    }
});

const NifGenerator = (props) => {
    const { classes } = props;

    const [inputValues, setinputValues] = useState({
        quantity: 1,
        type: 2,
    });

    const [nifList, setNifList] = useState([]);

    function handleChange(event) {
        setinputValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value,
        }));
    }

    function handleGenerateClick() {
        generateNifList();
    }

    function generateNifList() {
        let newNifList = [];

        for (let i=0; i < inputValues.quantity; i++) {
            const randomNif = generateNif(inputValues.type);

            newNifList.push(randomNif);
        }

        setNifList(() => newNifList)
    }
    
    return (
        <Grid container spacing={2} className={ classes.mainContainer }>
            <Grid item xs={12} className={ classes.header }>
                <img src={Logo} alt='app icon' className={ classes.image } />
                <Typography variant='h4' className={ classes.pageTitle }>
                    NIF Generator
                </Typography>
            </Grid>
            <Grid item xs={12} className={ classes.formContainer }>
                <FormControl className={`${classes.inputContainer} ${classes.typeContainer}`}>
                    <InputLabel htmlFor="type">
                        Type
                    </InputLabel>
                    <Select
                        value={inputValues.type}
                        onChange={handleChange}
                        className={ classes.input }
                        input={<Input name="type" id="type" />}>
                            {
                                nifTypes.map(nif => (
                                    <MenuItem key={nif.value} value={nif.value}>{`${nif.name} [${nif.value}]`}</MenuItem>
                                ))
                            }
                    </Select>
                </FormControl>
                <FormControl className={`${classes.inputContainer} ${classes.quantityContainer}`}>
                    <InputLabel htmlFor="quantity">
                        Quantity
                    </InputLabel>
                    <Select
                        value={inputValues.quantity}
                        onChange={handleChange}
                        className={ classes.input }
                        input={<Input name="quantity" id="quantity" />}>
                        {
                            [...Array(20)].map((e, i) => {
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
                    onClick={ handleGenerateClick }
                    className={ classes.button }>
                        Generate
                </Button>
            </Grid>
            <Grid item xs={12} className={ classes.resultContainer }>
                <List className={ `${classes.resultList}` }>
                    {
                        nifList.map((nif) => (
                            <ListItem key={ nif } >
                                <ListItemText primary={ nif } className={ `${classes.nif}` } />
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

export default withStyles(styles)(NifGenerator);
