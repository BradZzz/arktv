/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import H1 from 'components/H1';

import StarIcon from '@material-ui/icons/Star';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import messages from './messages';

import { makeSelectMedia } from '../ViewerPage/selectors';
import {
  checkMedia,
  setShow,
  setMediaPin,
  setMediaStar,
  setLoadingMedia,
} from '../ViewerPage/actions';

const useStyles = makeStyles(() => ({
  img: {
    opacity: 0.85,
    '&:hover': {
      opacity: 1,
    },
  },
}));

export function HomePage(props) {
  const classes = useStyles();
  const {
    media,
    onCheckMedia,
    onSetShow,
    onSetPin,
    onSetStar,
    onSetLoadingMedia,
  } = props;

  onCheckMedia();

  const tv = media.filter(med => med.episodes.length > 1);
  tv.sort((a, b) => b.created - a.created);

  const movies = media.filter(med => med.episodes.length === 1);
  movies.sort((a, b) => b.created - a.created);

  return (
    <article>
      <Helmet>
        <title>Home Page</title>
        <meta
          name="description"
          content="A React.js Boilerplate application homepage"
        />
      </Helmet>
      <H1>
        <FormattedMessage {...messages.header} />
      </H1>
      <Grid container direction="row">
        <Grid
          container
          style={{
            width: '40%',
            overflow: 'auto',
            maxHeight: '80vh',
            margin: '0 5%',
          }}
        >
          {tv.slice(0, 10).map(med => (
            <Grid
              container
              direction="row"
              key={med.imdbID}
              style={{
                height: '20em',
                border: '1px solid gray',
                margin: '.5em',
              }}
            >
              <Grid
                item
                style={{ width: '40%', height: '100%', padding: '2em' }}
              >
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */}
                <img
                  alt="television poster"
                  className={classes.img}
                  src={med.Poster}
                  style={{
                    height: '100%',
                    maxWidth: '11em',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    onSetPin(true);
                    onSetStar(true);
                    onSetLoadingMedia(false);
                    onSetShow(med);
                  }}
                />
              </Grid>
              <Grid item style={{ width: '55%', padding: '2em 0' }}>
                <Grid container direction="row">
                  <Grid item style={{ fontSize: '1.8em', fontWeight: 'bold' }}>
                    {med.Title}
                  </Grid>
                  <Grid item style={{ padding: '.7em' }}>
                    <StarIcon />
                    {med.imdbRating}
                  </Grid>
                </Grid>
                <Grid container direction="row" style={{ margin: '.6em 0' }}>
                  <Grid item style={{ marginRight: '.5em' }}>
                    <b>Season:</b>{' '}
                    {med.episodes[med.episodes.length - 1]
                      .split('/')[2]
                      .substring(0, 2)}
                  </Grid>
                  <Grid item>
                    <b>Episode:</b>{' '}
                    {med.episodes[med.episodes.length - 1]
                      .split('/')[2]
                      .substring(2, 4)}
                  </Grid>
                </Grid>
                <Grid item>{med.Plot}</Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
        <Grid
          container
          style={{
            width: '40%',
            overflow: 'auto',
            maxHeight: '80vh',
            margin: '0 5%',
          }}
        >
          {movies.slice(0, 10).map(med => (
            <Grid
              container
              direction="row"
              key={med.imdbID}
              style={{
                height: '20em',
                border: '1px solid gray',
                margin: '.5em',
              }}
            >
              <Grid
                item
                style={{ width: '40%', height: '100%', padding: '2em' }}
              >
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */}
                <img
                  alt="movie poster"
                  className={classes.img}
                  src={med.Poster}
                  style={{
                    height: '100%',
                    maxWidth: '11em',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    onSetLoadingMedia(false);
                    onSetShow(med);
                  }}
                />
              </Grid>
              <Grid item style={{ width: '55%', padding: '2em 0' }}>
                <Grid container direction="row">
                  <Grid item style={{ fontSize: '1.8em', fontWeight: 'bold' }}>
                    {med.Title}
                  </Grid>
                  <Grid item style={{ padding: '.7em' }}>
                    <StarIcon />
                    {med.imdbRating}
                  </Grid>
                </Grid>
                <Grid item>{med.Plot}</Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <div />
    </article>
  );
}

HomePage.propTypes = {
  media: PropTypes.array,
  onCheckMedia: PropTypes.func,
  onSetShow: PropTypes.func,
  onSetPin: PropTypes.func,
  onSetStar: PropTypes.func,
  onSetLoadingMedia: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  media: makeSelectMedia(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onCheckMedia: () => dispatch(checkMedia()),
    onSetShow: media => dispatch(setShow(media)),
    onSetPin: set => dispatch(setMediaPin(set)),
    onSetStar: set => dispatch(setMediaStar(set)),
    onSetLoadingMedia: set => dispatch(setLoadingMedia(set)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(HomePage);
