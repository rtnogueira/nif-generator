export const NifGeneratorStyles = theme => ({
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
        alignItems: 'center',
        margin: '20px 0',
        flexDirection: 'column',
    },
    resultList: {     
        maxWidth: '250px',
    },
    nif: {
        marginRight: '20px',
    }
});