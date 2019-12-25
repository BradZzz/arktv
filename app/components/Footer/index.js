import React, { useState } from 'react';

import Header from 'components/Header';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import StarIcon from '@material-ui/icons/Star';
import ReorderIcon from '@material-ui/icons/Reorder';
import PinDropIcon from '@material-ui/icons/PinDrop';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';

import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import TvIcon from '@material-ui/icons/Tv';
import LocalMoviesIcon from '@material-ui/icons/LocalMovies';
import ArtTrackIcon from '@material-ui/icons/ArtTrack';
import { initialState } from '../../containers/ViewerPage/reducer';
import {
  setMediaPin,
  setMediaStar,
  setMediaOrder,
  setSkipRewind,
  setSkipForward,
  setChannel,
  setShow,
} from '../../containers/ViewerPage/actions';
import {
  makeSelectCurrentMedia,
  makeSelectChannels,
  makeSelectCurrentChannel,
  makeSelectEpisode,
  makeSelectOptionsPin,
  makeSelectOptionsStar,
  makeSelectOptionsOrder,
} from '../../containers/ViewerPage/selectors';
import { makeSelectLocation } from '../../containers/App/selectors';

const useStyles = makeStyles(() => ({
  list: {
    opacity: 0.75,
    '&:hover': {
      opacity: 1,
    },
  },
}));

function Footer(props) {
  const classes = useStyles();
  const {
    pin,
    star,
    order,
    onSetPin,
    onSetStar,
    onSetOrder,
    onSkipRewind,
    onSkipForward,
    location,
    channels,
    selectedChannel,
    onSetChannel,
    onSetShow,
    selected,
    episode,
  } = props;

  const [showChannelChanger, setChannelChangerView] = useState(true);
  const [showMediaButtons, setMediaButtonView] = useState(false);
  const [showChannelInfo, setChannelView] = useState(true);
  const [showMediaList, setMediaListView] = useState(false);
  const [showMediaInfo, setMediaInfoView] = useState(false);

  const buttonMeta = {
    forward: {
      icon: <NavigateNextIcon />,
      onClick: () => {
        setMediaButtonView(true);
      },
    },
    back: {
      icon: <NavigateBeforeIcon />,
      onClick: () => {
        setMediaButtonView(false);
      },
    },
    channels: {
      icon: <TvIcon />,
      onClick: () => {
        setChannelView(true);
        setMediaListView(false);
        setMediaInfoView(false);
      },
    },
    media: {
      icon: <LocalMoviesIcon />,
      onClick: () => {
        setChannelView(false);
        setMediaListView(true);
        setMediaInfoView(false);
      },
    },
    media_info: {
      icon: <ArtTrackIcon />,
      onClick: () => {
        setChannelView(false);
        setMediaListView(false);
        setMediaInfoView(true);
      },
    },
  };

  const buttonNavInfo = (
    <ButtonGroup
      size="small"
      aria-label="small outlined button group"
      style={{ display: 'flex', height: '3em' }}
    >
      <Button style={{ flex: 1 }} onClick={buttonMeta.forward.onClick}>
        {buttonMeta.forward.icon}
      </Button>
      <Button style={{ flex: 1 }} onClick={buttonMeta.channels.onClick}>
        {buttonMeta.channels.icon}
      </Button>
      <Button style={{ flex: 1 }} onClick={buttonMeta.media.onClick}>
        {buttonMeta.media.icon}
      </Button>
      <Button style={{ flex: 1 }} onClick={buttonMeta.media_info.onClick}>
        {buttonMeta.media_info.icon}
      </Button>
    </ButtonGroup>
  );

  const buttonNavMedia = (
    <ButtonGroup
      size="small"
      aria-label="small outlined button group"
      style={{ display: 'flex', height: '3em' }}
    >
      <Button style={{ flex: 1 }} onClick={buttonMeta.back.onClick}>
        {buttonMeta.back.icon}
      </Button>
      <Button style={{ flex: 1 }} onClick={() => onSkipRewind()}>
        <FastRewindIcon />
      </Button>
      <Button
        style={{ flex: 1, color: star ? 'red' : 'black' }}
        onClick={() => onSetStar(!star)}
      >
        <StarIcon />
      </Button>
      <Button
        style={{ flex: 1, color: order ? 'red' : 'black' }}
        onClick={() => onSetOrder(!order)}
      >
        <ReorderIcon />
      </Button>
      <Button
        style={{ flex: 1, color: pin ? 'red' : 'black' }}
        onClick={() => onSetPin(!pin)}
      >
        <PinDropIcon />
      </Button>
      <Button style={{ flex: 1 }} onClick={() => onSkipForward()}>
        <FastForwardIcon />
      </Button>
    </ButtonGroup>
  );

  let mediaView = <></>;
  if ('media' in selectedChannel) {
    mediaView = selectedChannel.media.map(med => (
      <ListItem
        className={classes.list}
        key={med.imdbID}
        onClick={() => {
          onSetShow(med);
          buttonMeta.media_info.onClick();
        }}
        style={{
          height: '5em',
          width: '92%',
          display: 'flex',
          background: 'antiquewhite',
          border: '.2em solid black',
          margin: '1em',
          padding: '.2em',
          cursor: 'pointer',
        }}
      >
        <img
          alt="media"
          src={med.Poster}
          style={{
            height: '100%',
            maxWidth: '4em',
            borderRadius: '1em',
            margin: '.4em',
            border: '1px solid',
          }}
        />
        <span style={{ marginLeft: '1em' }}>{med.Title}</span>
      </ListItem>
    ));
    mediaView = (
      <List style={{ maxHeight: '50vh', overflow: 'auto', padding: '1em' }}>
        {mediaView}
      </List>
    );
  }

  const channelView = (
    <List style={{ maxHeight: '50vh', overflow: 'auto', padding: '1em' }}>
      {channels.map(chan => (
        <ListItem
          className={classes.list}
          key={chan.name}
          onClick={() => {
            onSetChannel(chan);
            buttonMeta.media.onClick();
          }}
          style={{
            height: '5em',
            width: '92%',
            display: 'flex',
            background: 'antiquewhite',
            border: '.2em solid black',
            margin: '1em',
            padding: '.2em',
            cursor: 'pointer',
          }}
        >
          <span style={{ marginLeft: '1em' }}>{chan.name}</span>
        </ListItem>
      ))}
    </List>
  );

  const seasonTxt = episode && episode.split('/')[2].substring(0, 2);
  const episodeTxt = episode && episode.split('/')[2].substring(2, 4);

  console.log('seasonTxt', seasonTxt, episodeTxt)

  const showEps = (
    <Grid container>
      <Grid item style={{ marginRight: '.5em' }}>
        <b>Season:</b> {seasonTxt}
      </Grid>
      <Grid item>
        <b>Episode:</b> {episodeTxt}
      </Grid>
    </Grid>
  );
  const noShowEps = <></>;

  const episodeInfo = 'episodes' in selected && selected.episodes.length > 1 ? showEps : noShowEps

  const mediaInfoView =
    initialState.currentMedia === selected ? (
      <div
        style={{ margin: '1em auto', textAlign: 'center', fontWeight: 'bold' }}
      >
        No Media Loaded
      </div>
    ) : (
      <Grid
        container
        spacing={3}
        style={{
          width: '100%',
          maxHeight: '50vh',
          overflow: 'auto',
          padding: '1em',
        }}
      >
        <Grid container style={{ width: '100%', padding: '1em 2em' }}>
          <Grid item style={{ textAlign: 'center', width: '100%' }}>
            <h2 style={{ margin: '.5em auto' }}>{selected.Title}</h2>
          </Grid>
          <Grid item style={{ margin: '0 auto' }}>
            <a
              href={`https://www.imdb.com/title/${selected.imdbID}/`}
              target="_blank"
              style={{ margin: '0 auto .5em auto' }}
            >
              <img alt="media" src={selected.Poster} />
            </a>
          </Grid>
          <Grid container>
            { episodeInfo }
            <Grid container>
              <Grid item style={{ margin: '1em 0', fontStyle: 'italic' }}>
                {selected.Plot}
              </Grid>
              <Grid item style={{ width: '100%' }}>
                <b>Ratings:</b>
              </Grid>
              {'Ratings' in selected ? (
                selected.Ratings.map(rating => (
                  <Grid item style={{ paddingLeft: '1em' }}>
                    {rating.Value.replace('/', ' / ')} ({rating.Source})
                  </Grid>
                ))
              ) : (
                <></>
              )}
            </Grid>
            <Grid container>
              <Grid item style={{ width: '100%' }}>
                <b>Director:</b>
              </Grid>
              <Grid item style={{ paddingLeft: '1em', width: '100%' }}>
                {selected.Director}
              </Grid>
            </Grid>
            <Grid container>
              <Grid item style={{ width: '100%' }}>
                <b>Writers:</b>
              </Grid>
              {'Writer' in selected ? (
                selected.Writer.split(', ').map(writer => (
                  <Grid item style={{ paddingLeft: '1em', width: '100%' }}>
                    {writer}
                  </Grid>
                ))
              ) : (
                <></>
              )}
            </Grid>
            <Grid container>
              <Grid item style={{ width: '100%' }}>
                <b>Actors:</b>
              </Grid>
              {'Actors' in selected ? (
                selected.Actors.split(', ').map(actor => (
                  <Grid item style={{ paddingLeft: '1em', width: '100%' }}>
                    {actor}
                  </Grid>
                ))
              ) : (
                <></>
              )}
            </Grid>
            <Grid container>
              <Grid item style={{ width: '100%' }}>
                <b>Genres:</b>
              </Grid>
              {'Genre' in selected ? (
                selected.Genre.split(', ').map(genre => (
                  <Grid item style={{ paddingLeft: '1em', width: '100%' }}>
                    {genre}
                  </Grid>
                ))
              ) : (
                <></>
              )}
            </Grid>
            <Grid container>
              <Grid item style={{ width: '100%' }}>
                <b>Awards:</b>
              </Grid>
              <Grid item style={{ paddingLeft: '1em', width: '100%' }}>
                {selected.Awards}
              </Grid>
            </Grid>
            <Grid container>
              <Grid item style={{ width: '100%' }}>
                <b>Total Seasons:</b>
              </Grid>
              <Grid item style={{ paddingLeft: '1em', width: '100%' }}>
                {selected.totalSeasons}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );

  let mediaToggleFloggle = <></>;
  if (showChannelInfo) {
    mediaToggleFloggle = channelView;
  } else if (showMediaList) {
    mediaToggleFloggle = mediaView;
  } else if (showMediaInfo) {
    mediaToggleFloggle = mediaInfoView;
  }

  const mView = showMediaButtons ? buttonNavMedia : buttonNavInfo;

  return (
    <div
      style={{
        padding: '1em 0',
        position: 'fixed',
        width: '100%',
        bottom: 0,
        height: showChannelChanger ? '60vh' : '5em',
        background: 'white',
      }}
    >
      <div style={{ width: '100%', padding: '0 1em' }}>
        <Header
          showingNav={showChannelChanger}
          onCloseClick={() => {
            setChannelChangerView(false);
          }}
          onOpenClick={() => {
            setChannelChangerView(true);
          }}
        />
        {showChannelChanger && location.pathname === '/viewer' ? mView : <></>}
      </div>
      <div style={{ width: '100%' }}>
        <div
          style={{
            display:
              showChannelChanger && location.pathname === '/viewer'
                ? 'block'
                : 'none',
            padding: '1em',
          }}
        >
          {mediaToggleFloggle}
        </div>
      </div>
    </div>
  );
}

Footer.propTypes = {
  onSetChannel: PropTypes.func,
  onSetShow: PropTypes.func,

  onSetPin: PropTypes.func,
  onSetStar: PropTypes.func,
  onSetOrder: PropTypes.func,

  onSkipRewind: PropTypes.func,
  onSkipForward: PropTypes.func,

  channels: PropTypes.array,
  selectedChannel: PropTypes.object,
  selected: PropTypes.object,
  episode: PropTypes.string,

  pin: PropTypes.bool,
  star: PropTypes.bool,
  order: PropTypes.bool,
  location: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  selectedChannel: makeSelectCurrentChannel(),
  channels: makeSelectChannels(),
  selected: makeSelectCurrentMedia(),
  episode: makeSelectEpisode(),

  pin: makeSelectOptionsPin(),
  star: makeSelectOptionsStar(),
  order: makeSelectOptionsOrder(),
  location: makeSelectLocation(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onSetShow: media => dispatch(setShow(media)),
    onSetChannel: channel => dispatch(setChannel(channel)),

    onSkipRewind: () => dispatch(setSkipRewind()),
    onSetPin: pin => dispatch(setMediaPin(pin)),
    onSetStar: star => dispatch(setMediaStar(star)),
    onSetOrder: order => dispatch(setMediaOrder(order)),
    onSkipForward: () => dispatch(setSkipForward()),
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Footer);
