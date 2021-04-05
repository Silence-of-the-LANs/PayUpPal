import React, { useContext, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { UserContext } from '../Store';
import { makeStyles } from '@material-ui/core/styles';
import ImageCarousel from './ImageCarousel';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  CssBaseline,
  Grid,
  Link,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

export default function Home() {
  const classes = useStyles();
  const [user, setUser] = useContext(UserContext);

  return !user ? (
    <Container maxWidth='lg'>
      <ImageCarousel />
    </Container>
  ) : (
    <React.Fragment>
      <CssBaseline />
      <main>
        <Container className={classes.cardGrid} maxWidth='false'>
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <CardActionArea component={RouterLink} to={'/scanreceipt'}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image='https://payuppal-site-images.s3.amazonaws.com/scan-manage-receipts-resized.jpeg'
                    title='Manage receipts'
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant='h5' component='h2'>
                      Scan Receipt
                    </Typography>
                    <Typography>Scan and upload a new receipt</Typography>
                  </CardContent>
                </Card>
              </CardActionArea>
            </Grid>
            <Grid item xs={12} md={3}>
              <CardActionArea component={RouterLink} to={'/managefriends'}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image='https://payuppal-site-images.s3.amazonaws.com/manage-friends.jpeg'
                    title='Manage friends'
                    // style={{ height: '300px' }}
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant='h5' component='h2'>
                      Friends
                    </Typography>
                    <Typography>Add friends or edit their details</Typography>
                  </CardContent>
                </Card>
              </CardActionArea>
            </Grid>
            <Grid item xs={12} md={3}>
              <CardActionArea component={RouterLink} to={'/managedebts'}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image='https://payuppal-site-images.s3.amazonaws.com/manage-money-owed-resized.jpg'
                    title='Manage debts'
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant='h5' component='h2'>
                      Debts
                    </Typography>
                    <Typography>Manage payments owed to you</Typography>
                  </CardContent>
                </Card>
              </CardActionArea>
            </Grid>
            <Grid item xs={12} md={3}>
              <CardActionArea component={RouterLink} to={'/receipthistory'}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image='https://payuppal-site-images.s3.amazonaws.com/history-resized.jpg'
                    title='View history'
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant='h5' component='h2'>
                      View History
                    </Typography>
                    <Typography>View previously entered receipts</Typography>
                  </CardContent>
                </Card>
              </CardActionArea>
            </Grid>
          </Grid>
        </Container>
      </main>
    </React.Fragment>
  );
}

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//     minHeight: '100vh',
//   },
//   centerColumn: {
//     height: 750,
//   },
// }));

// const Home = () => {
//   const classes = useStyles();
//   const [user, setUser] = useContext(UserContext);

//   return (
//     <Grid container direction='column' align='center'>
//       <Grid
//         item
//         container
//         className={classes.centerColumn}
//         direction='column'
//         display='flex'
//         justify='center'
//       >
//         {!user ? (
//           <Typography variant='h2'>You Are Not Logged In</Typography>
//         ) : (
//           <Typography variant='h2' color='primary'>
//             You Are Logged In
//           </Typography>
//         )}
//       </Grid>
//       <CssBaseline />
//     </Grid>
//   );
// };
//
// export default Home;
