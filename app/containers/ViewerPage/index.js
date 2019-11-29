/*
 * FeaturePage
 *
 * List all the features
 */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import H1 from 'components/H1';
import CastPlayer from 'components/CastPlayer';
import messages from './messages';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
//import CastPlayer from './Cast';

import play from './images/play.png';
import pause from './images/pause.png';
import pauseHover from './images/pause-hover.png';
import pausePress from './images/pause-press.png';
import playHover from './images/play-hover.png';
import playPress from './images/play-press.png';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import CollectionsIcon from '@material-ui/icons/Collections';
import Grid from '@material-ui/core/Grid';


import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import TvIcon from '@material-ui/icons/Tv';
import LocalMoviesIcon from '@material-ui/icons/LocalMovies';
import ArtTrackIcon from '@material-ui/icons/ArtTrack';


import { makeSelectCurrentMedia, makeSelectMedia, makeSelectChannels, makeSelectCurrentChannel, makeSelectEpisode } from './selectors';
import { checkMedia, checkNextMedia, setChannel, setShow } from './actions';
import { initialState } from './reducer';

const useStyles = makeStyles(theme => {
  return {
    fab: {
      margin: theme.spacing(1),
    },
    mediaWrap: {
      height: '4em',
      background: '#000000',
    },
    play: {
      height: '3em',
      margin: '1em',
      backgroundImage: 'url("' + play + '")',
      '&:hover': {
        backgroundImage: 'url("' + playHover + '")',
      },
      '&:press': {
        backgroundImage: 'url("' + playPress + '")',
      },
    },
    pause: {
      height: '3em',
      margin: '1em',
      backgroundImage: 'url("' + pause + '")',
      '&:hover': {
        backgroundImage: 'url("' + pauseHover + '")',
      },
      '&:press': {
        backgroundImage: 'url("' + pausePress + '")',
      },
    },
  };
});

export function ViewerPage(props) {
  const classes = useStyles();

  console.log("props ViewerPage", props)

  const { media, channels, selectedChannel, onCheckMedia, onSetMedia, onSetChannel, onSetShow, selected, episode } = props

  const [showChannelChanger, setChannelChangerView] = useState(true);
  const [showChannelInfo, setChannelView] = useState(true);
  const [showMediaList, setMediaListView] = useState(false);
  const [showMediaInfo, setMediaInfoView] = useState(false);


  const buttonMeta = {
    back: {
      icon: (<NavigateBeforeIcon/>),
      onClick: () => {
        setChannelView(false)
        setMediaListView(false);
        setMediaInfoView(false);
      }
    },
    channels: {
      icon: (<TvIcon/>),
      onClick: () => {
        setChannelView(true)
        setMediaListView(false);
        setMediaInfoView(false);
      }
    },
    media: {
      icon: (<LocalMoviesIcon/>),
      onClick: () => {
        setChannelView(false)
        setMediaListView(true);
        setMediaInfoView(false);
      }
    },
    media_info: {
      icon: (<ArtTrackIcon/>),
      onClick: () => {
        setChannelView(false)
        setMediaListView(false);
        setMediaInfoView(true);
      }
    },
  }

  onCheckMedia()

  let mediaView = (<></>)
  if ('media' in selectedChannel) {
    mediaView = selectedChannel.media.map(med => (
      <ListItem key={ med.imdbID } onClick={() => { onSetShow(med); buttonMeta.media_info.onClick(); }} style={{ height: '5em', width: '92%', display: 'flex', background: 'antiquewhite', border: '.2em solid black', margin: '1em', padding: '.2em', cursor: 'pointer' }}>
        <img src={med.Poster} style={{ height: '100%', maxWidth: '4em', borderRadius: '1em', margin: '.4em', border: '1px solid' }}/>
        <span style={{ marginLeft: '1em' }}>
          { med.Title }
        </span>
      </ListItem>
    ))
    mediaView = (<List>{mediaView}</List>)
  }

  let channelView = (
    <List>
      { channels.map(chan => (
        <ListItem key={ chan.name } onClick={() => { onSetChannel(chan); buttonMeta.media.onClick(); }} style={{ height: '5em', width: '92%', display: 'flex', background: 'antiquewhite', border: '.2em solid black', margin: '1em', padding: '.2em', cursor: 'pointer' }}>
          <span style={{ marginLeft: '1em' }}>
            { chan.name }
          </span>
        </ListItem>
      )) }
    </List>
  )

  let mediaInfoView = initialState.currentMedia === selected ? (<div style={{ margin: '1em auto', textAlign: 'center', fontWeight: 'bold' }}>No Media Loaded</div>) :
    (<Grid container spacing={3} style={{ width: '100%' }}>
      <Grid container style={{ width: '100%', padding: '1em 2em' }}>
        <h2 style={{ margin: '.5em auto' }}>{selected.Title}</h2>
        <a href={'https://www.imdb.com/title/' + selected.imdbID + '/'} target="_blank" style={{ margin: '0 auto .5em auto' }}><img src={selected.Poster}/></a>
        <Grid container>
          <Grid item style={{ margin: '1em 0', fontStyle: 'italic' }}>{selected.Plot}</Grid>
          {selected.episodes.length <= 1 ? <></> :
          (<>
            <Grid item style={{ marginRight: '.5em' }}><b>Season:</b> {episode.split('/')[2].substring(0,2)}</Grid>
            <Grid item><b>Episode:</b> {episode.split('/')[2].substring(2,4)}</Grid>
          </>)}
          <Grid container>
            <Grid item style={{ width: '100%' }}><b>Ratings:</b></Grid>
            { selected.Ratings.map(rating => (<Grid item style={{ paddingLeft: '1em' }}>{ rating.Value.replace('/', ' / ') } ({ rating.Source })</Grid>)) }
          </Grid>
          <Grid container>
            <Grid item style={{ width: '100%' }}><b>Director:</b></Grid>
            <Grid item style={{ paddingLeft: '1em', width: '100%' }}>{ selected.Director }</Grid>
          </Grid>
          <Grid container>
            <Grid item style={{ width: '100%' }}><b>Writers:</b></Grid>
            { selected.Writer.split(', ').map(writer => (<Grid item style={{ paddingLeft: '1em', width: '100%' }}>{ writer }</Grid>)) }
          </Grid>
          <Grid container>
            <Grid item style={{ width: '100%' }}><b>Actors:</b></Grid>
            { selected.Actors.split(', ').map(actor => (<Grid item style={{ paddingLeft: '1em', width: '100%' }}>{ actor }</Grid>)) }
          </Grid>
          <Grid container>
            <Grid item style={{ width: '100%' }}><b>Genres:</b></Grid>
            { selected.Genre.split(', ').map(genre => (<Grid item style={{ paddingLeft: '1em', width: '100%' }}>{ genre }</Grid>)) }
          </Grid>
          <Grid container>
            <Grid item style={{ width: '100%' }}><b>Awards:</b></Grid>
            <Grid item style={{ paddingLeft: '1em', width: '100%' }}>{ selected.Awards }</Grid>
          </Grid>
          <Grid container>
            <Grid item style={{ width: '100%' }}><b>Total Seasons:</b></Grid>
            <Grid item style={{ paddingLeft: '1em', width: '100%' }}>{ selected.totalSeasons }</Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>)

  let mediaToggleFloggle = (<></>)
  if (showChannelInfo) {
    mediaToggleFloggle = channelView
  } else if (showMediaList) {
    mediaToggleFloggle = mediaView
  } else if (showMediaInfo) {
    mediaToggleFloggle = mediaInfoView
  }

  let buttonNav = (<Grid item>
                     <ButtonGroup size="small" aria-label="small outlined button group" style={{ display: 'flex', height: '3em' }}>
                       <Button style={{ flex: 1 }} onClick={buttonMeta.back.onClick}>{ buttonMeta.back.icon }</Button>
                       <Button style={{ flex: 1 }} onClick={buttonMeta.channels.onClick}>{ buttonMeta.channels.icon }</Button>
                       <Button style={{ flex: 1 }} onClick={buttonMeta.media.onClick}>{ buttonMeta.media.icon }</Button>
                       <Button style={{ flex: 1 }} onClick={buttonMeta.media_info.onClick}>{ buttonMeta.media_info.icon }</Button>
                     </ButtonGroup>
                   </Grid>)

  return (
    <div>
      <Helmet>
        <title>ArkTv2</title>
        <meta
          name="description"
          content="Feature page of React.js Boilerplate application"
        />
      </Helmet>
      <H1>
        <FormattedMessage {...messages.header} />
      </H1>
      <div style={{ display: 'flex' }}>
        <Paper style={{maxHeight: '42em', minHeight: '42em', overflow: 'auto', width: '25%', border: '1px solid' }}>
          { buttonNav }
          { mediaToggleFloggle }
        </Paper>
        <CastPlayer selected={selected} channel={selectedChannel} onSetMedia={onSetMedia} />
      </div>
    </div>
  )
}

ViewerPage.propTypes = {
  media: PropTypes.array,
  channels: PropTypes.array,
  selectedChannel: PropTypes.object,
  onCheckMedia: PropTypes.func,
  onSetMedia: PropTypes.func,
  onSetChannel: PropTypes.func,
  onSelectLoadingMedia: PropTypes.func,
  onSetShow: PropTypes.func,
  episode: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  media: makeSelectMedia(),
  selectedChannel: makeSelectCurrentChannel(),
  channels: makeSelectChannels(),
  selected: makeSelectCurrentMedia(),
  episode: makeSelectEpisode(),
})

export function mapDispatchToProps(dispatch) {
  return {
    onCheckMedia: () => dispatch(checkMedia()),
    onSetMedia: () => dispatch(checkNextMedia()),
    onSetShow: (media) => dispatch(setShow(media)),
    onSetChannel: (channel) => dispatch(setChannel(channel)),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewerPage);
