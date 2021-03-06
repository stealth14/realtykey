import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import { red } from '@material-ui/core/colors';

import Divider from '@material-ui/core/Divider';

//custom comps
import ProfileAvatar from './ProfileAvatar.js'
import PropertyDetails from './PropertyDetails'
import MoneyView from './MoneyView';
import Features from '../Features';
import Grid from '@material-ui/core/Grid';

import ImagesPreview from '../PropertyForm/ImagesPreview.js'

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: 30,
    backgroundColor: theme.palette.background.custom,
    fontSize: '14px',
    maxWidth: window.screen.width < 600 ? window.screen.width : 600,
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
    }
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },

  comission: {
    backgroundColor: '#ffe082',
    color: 'black'
  },

  placeholder: {
    color: "gray",
    size: '5px'
  },

  highlight: {
    color: "gray"
  },

  address: {

  }

}));

export default function PropertyCard(props) {
  const classes = useStyles();
  let data = props.doc.data();

  return (
    <Card className={classes.root}>
      <ProfileAvatar uid={data.uid} />

      <CardContent>
        <ImagesPreview urls={data.photos} />
      </CardContent>

      <CardActions >

        <Grid container spacing={2} direction="column" >

          <Grid item direction="column" spacing={2} container>

            <PropertyDetails propData={data} />

            <Divider variant="middle" />

            <MoneyView propData={data} />

          </Grid>

          <Divider variant="middle" />

          <Features propData={data}/>

        </Grid>

      </CardActions>

    </Card>
  );
}


