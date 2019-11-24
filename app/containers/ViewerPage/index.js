/*
 * FeaturePage
 *
 * List all the features
 */
import React from 'react';
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
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';

import { makeSelectMedia } from './selectors';
import { checkMedia, setMedia } from './actions';

const useStyles = makeStyles(theme => {
  return {
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

  console.log("props", props)

  const { media, onCheckMedia, onSetMedia } = props

  onCheckMedia()

  let player = (<></>)
  window['__onGCastApiAvailable'] = function (isAvailable) {
    if (isAvailable) {
      console.log('available')
      player = (<CastPlayer/>)
    }
  };

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (side, open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [side]: open });
  }

  const sideList = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      <Helmet>
        <title>Viewer Page</title>
        <meta
          name="description"
          content="Feature page of React.js Boilerplate application"
        />
      </Helmet>
      <H1>
        <FormattedMessage {...messages.header} />
      </H1>
      <div style={{ display: 'flex' }}>
        <CastPlayer/>
        <Paper style={{maxHeight: '65vh', overflow: 'auto'}}>
          <List>
          { media.map(med => (
            <ListItem key={ med.imdbID } onClick={() => onSetMedia(med)} style={{ height: '5em', width: '95%', display: 'flex', background: 'antiquewhite', border: '.2em solid black', margin: '1em', padding: '.2em', cursor: 'pointer' }}>
              <img src={med.Poster} style={{ height: '100%', maxWidth: '4em' }}/>
              <span>
                { med.Title }
              </span>
            </ListItem>
          )) }
          </List>
        </Paper>
      </div>
    </div>
  )
}

ViewerPage.propTypes = {
  media: PropTypes.array,
  onCheckMedia: PropTypes.func,
  onSetMedia: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  media: makeSelectMedia(),
})

export function mapDispatchToProps(dispatch) {
  return {
    onCheckMedia: () => dispatch(checkMedia()),
    onSetMedia: (media) => dispatch(setMedia(media)),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewerPage);
