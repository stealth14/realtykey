import React, { useState } from 'react';
import MenuButton from './MenuButton.js'
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

/*ENRUTAMIENTO*/
import {
    Link,
} from "react-router-dom";

//icons
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faHandshake } from "@fortawesome/free-solid-svg-icons";
import { faHandHoldingUsd } from "@fortawesome/free-solid-svg-icons";
import { faThLarge } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";

import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useHistory } from "react-router-dom";


const root = {
    background: `
    linear-gradient(to bottom right, rgba(72, 72, 212, 0), rgba(241, 104, 104, 0)), url('../header.jpg') center center no-repeat
    `,
    backgroundSize: 'cover',
    height: '100vh',
    overflow: 'scroll',
    whiteSpace: 'nowrap',
}

const title = {
    color: 'white',
    paddingTop: '20px',
    fontWeight: '600',
}


const link = {
    textDecoration: 'none',
}

const useStyles = makeStyles((theme) => ({
    layout: {
        [theme.breakpoints.up('sm')]: {
            position: 'relative',
            top: '50%',
            transform: 'translateY(-50%)',
        },
        [theme.breakpoints.only('xs')]: {
            paddingTop: 20,
        },
    },
}));

export default function Dashboard1() {
    const userData = useSelector(state => state.general.userData);
    const classes = useStyles();
    const history = useHistory();

    const pushMyPanel = () => {
        history.push(
            {
                pathname:'/Home/MyPanel',
                tab: 0
            });
    }


    return (
        <div style={root}>
            <div className={classes.layout}>
                <Grid
                    container
                    justify="center"
                >
                    <Grid item align="center" xs={12} sm={4} md={4} lg={3}>
                        <a style={link} onClick={pushMyPanel}>
                            <MenuButton icon={faThLarge} background='#27233180' />
                            <Typography style={title} variant="h6" align="center" gutterBottom>
                                Mi panel
                        </Typography>
                        </a>
                    </Grid>

                    <Grid item align="center" xs={12} sm={4} md={4} lg={3}>
                        <Link style={link} to={`/Home/PublicArea/prop`}>
                            <MenuButton icon={faHome} background='#27233180' />
                            <Typography style={title} variant="h6" align="center" gutterBottom>
                                Propiedades
                        </Typography>
                        </Link>
                    </Grid>

                    <Grid item align="center" xs={12} sm={4} md={4} lg={3}>
                        <Link style={link} to={`/Home/PublicArea/req`}>
                            <MenuButton icon={faHandHoldingUsd} background='#27233180' />
                            <Typography style={title} variant="h6" align="center" gutterBottom>
                                Requerimientos
                        </Typography>
                        </Link>
                    </Grid>

                    <Grid item align="center" xs={12} sm={4} md={4} lg={3}>
                        <Link style={link} to={`/Home/MatchView`}>
                            <MenuButton icon={faHandshake} background='#27233180' />
                            <Typography style={title} variant="h6" align="center" gutterBottom>
                                Matches
                        </Typography>
                        </Link>
                    </Grid>

                    <Grid item align="center" xs={12} sm={4} md={4} lg={3}>
                        <Link style={link} to={`/Home/News`}>
                            <MenuButton icon={faNewspaper} background='#27233180' />
                            <Typography style={title} variant="h6" align="center" gutterBottom>
                                Noticias
                        </Typography>
                        </Link>
                    </Grid>
                    {userData?.roles.includes("admin") &&
                        <Grid item align="center" xs={12} sm={4} md={4} lg={3}>
                            <Link style={link} to={`/Home/profiles`}>
                                <MenuButton icon={faCrown} background='#27233180' />
                                <Typography style={title} variant="h6" align="center" gutterBottom>
                                    Administrador
                        </Typography>
                            </Link>
                        </Grid>
                    }
                </Grid>
            </div>
        </div>
    )
}
