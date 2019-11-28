/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import H1 from 'components/H1';

import H2 from 'components/H2';
import ReposList from 'components/ReposList';
import AtPrefix from './AtPrefix';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import messages from './messages';
import reducer from './reducer';
import saga from './saga';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import StarIcon from '@material-ui/icons/Star';

import { makeSelectMedia } from '../ViewerPage/selectors';
import { checkMedia } from '../ViewerPage/actions';
import Grid from '@material-ui/core/Grid';

const key = 'home';

export function HomePage(props) {
  const { media, onCheckMedia } = props

  onCheckMedia()

  const tv = media.filter(med => med.episodes.length > 1)
  tv.sort(function(a, b) {
      return b.created - a.created;
  })

  const movies = media.filter(med => med.episodes.length === 1)
  movies.sort(function(a, b) {
      return b.created - a.created;
  })

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
        <Grid container style={{ width: '40%', overflow: 'auto', maxHeight: '48em', margin: '0 5%'  }}>
          { tv.slice(0,10).map(med => (
            <Grid container direction="row" key={med.imdbID} style={{ height: "20em", border: '1px solid gray', margin: '.5em' }}>
              <Grid item style={{ width: '40%', height: '100%', padding: '2em' }}>
                <img src={med.Poster} style={{ height: '100%', maxWidth: '11em' }}/>
              </Grid>
              <Grid item style={{ width: '55%', padding: '2em 0' }}>
                <Grid container direction="row">
                  <Grid item style={{ fontSize: '2em', fontWeight: 'bold' }}>
                    {med.Title}
                  </Grid>
                  <Grid item style={{ padding: '.7em' }}>
                    <StarIcon />
                    {med.imdbRating}
                  </Grid>
                </Grid>
                <Grid container direction="row" style={{ margin: '.6em 0'}}>
                  <Grid item style={{ marginRight: '.5em' }}><b>Season:</b> {med.episodes[med.episodes.length - 1].split('/')[2].substring(0,2)}</Grid>
                  <Grid item><b>Episode:</b> {med.episodes[med.episodes.length - 1].split('/')[2].substring(2,4)}</Grid>
                </Grid>
                <Grid item>
                  {med.Plot}
                </Grid>
              </Grid>
            </Grid>
          )) }
        </Grid>
        <Grid container style={{ width: '40%', overflow: 'auto', maxHeight: '48em', margin: '0 5%'  }}>
          { movies.slice(0,10).map(med => (
            <Grid container direction="row" key={med.imdbID} style={{ height: "20em", border: '1px solid gray', margin: '.5em' }}>
              <Grid item style={{ width: '40%', height: '100%', padding: '2em' }}>
                <img src={med.Poster} style={{ height: '100%', maxWidth: '11em' }}/>
              </Grid>
              <Grid item style={{ width: '55%', padding: '2em 0' }}>
                <Grid container direction="row">
                  <Grid item style={{ fontSize: '2em', fontWeight: 'bold' }}>
                    {med.Title}
                  </Grid>
                  <Grid item style={{ padding: '.7em' }}>
                    <StarIcon />
                    {med.imdbRating}
                  </Grid>
                </Grid>
                <Grid item>
                  {med.Plot}
                </Grid>
              </Grid>
            </Grid>
          )) }
        </Grid>
      </Grid>
      <div>
      </div>
    </article>
  );
}

HomePage.propTypes = {
  media: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  media: makeSelectMedia(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onCheckMedia: () => dispatch(checkMedia()),
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
