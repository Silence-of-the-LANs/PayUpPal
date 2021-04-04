import React, { useContext, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { UserContext } from '../Store';
import { makeStyles } from '@material-ui/core/styles';
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
import Paper from '@material-ui/core/Paper';
import backgroundImage from '../../public/bg.jpeg';

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link
        color='inherit'
        href='https://github.com/Silence-of-the-LANs/billsplitter'
      >
        PayUpPal
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        <Container className={classes.cardGrid} maxWidth='md'>
          {/* End hero unit */}
          <Grid container spacing={10}>
            <Grid item xs={12} md={6}>
              <CardActionArea component={RouterLink} to={'/scanreceipt'}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image='https://source.unsplash.com/random'
                    title='Image title'
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant='h5' component='h2'>
                      Scan Receipt
                    </Typography>
                    <Typography>Scan a receipt</Typography>
                  </CardContent>
                </Card>
              </CardActionArea>
            </Grid>
            <Grid item xs={12} md={6}>
              <CardActionArea component={RouterLink} to={'/managefriends'}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image='https://source.unsplash.com/random'
                    title='Image title'
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant='h5' component='h2'>
                      Friends
                    </Typography>
                    <Typography>Mange your friends</Typography>
                  </CardContent>
                </Card>
              </CardActionArea>
            </Grid>
            <Grid item xs={12} md={6}>
              <CardActionArea component={RouterLink} to={'/managedebts'}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image='https://source.unsplash.com/random'
                    title='Image title'
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant='h5' component='h2'>
                      Debts
                    </Typography>
                    <Typography>Manage your debts</Typography>
                  </CardContent>
                </Card>
              </CardActionArea>
            </Grid>
            <Grid item xs={12} md={6}>
              <CardActionArea component={RouterLink} to={'/receipthistory'}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image='https://source.unsplash.com/random'
                    title='Image title'
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant='h5' component='h2'>
                      View History
                    </Typography>
                    <Typography>
                      View your previously entered receipts
                    </Typography>
                  </CardContent>
                </Card>
              </CardActionArea>
            </Grid>
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant='h6' align='center' gutterBottom>
          Footer
        </Typography>
        <Typography
          variant='subtitle1'
          align='center'
          color='textSecondary'
          component='p'
        >
          Designed by Jason Liao, Tommy Liu, and Zoran Bajic
        </Typography>
        <Copyright />
      </footer>
      {/* End footer */}
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
