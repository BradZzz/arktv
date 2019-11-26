import React from 'react';
import { FormattedMessage } from 'react-intl';

import A from 'components/A';
import LocaleToggle from 'containers/LocaleToggle';
import Wrapper from './Wrapper';
import messages from './messages';
import Header from 'components/Header';
import Fab from '@material-ui/core/Fab';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import StarIcon from '@material-ui/icons/Star';
import ReorderIcon from '@material-ui/icons/Reorder';
import PinDropIcon from '@material-ui/icons/PinDrop';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';

import { makeSelectOptionsPin, makeSelectOptionsStar, makeSelectOptionsOrder } from '../../containers/ViewerPage/selectors';
import { setMediaPin, setMediaStar, setMediaOrder, setSkipRewind, setSkipForward } from '../../containers/ViewerPage/actions';

function Footer(props) {
  const { pin, star, order, onSetPin, onSetStar, onSetOrder, onSkipRewind, onSkipForward } = props
  return (
    <Wrapper style={{ padding: '1em 0' }}>
      <div style={{ width: '50%' }}>
        <Header/>
      </div>
      <div style={{ width: '50%' }}>
        <div style={{ margin: '0 auto', width: '35em' }}>
          <Fab onClick={() => onSkipRewind()} style={{ margin: '0 2em' }} color="primary">
            <FastRewindIcon />
          </Fab>
          <Fab onClick={() => onSetStar(!star)} style={{ margin: '0 2em' }} color={ star ? "primary" : "secondary" }>
            <StarIcon />
          </Fab>
          <Fab onClick={() => onSetOrder(!order)} style={{ margin: '0 2em' }} color={ order ? "primary" : "secondary" }>
            <ReorderIcon />
          </Fab>
          <Fab onClick={() => onSetPin(!pin)} style={{ margin: '0 2em' }} color={ pin ? "primary" : "secondary" }>
            <PinDropIcon />
          </Fab>
          <Fab onClick={() => onSkipForward()} style={{ margin: '0 2em' }} color="primary">
            <FastForwardIcon />
          </Fab>
        </div>
      </div>
    </Wrapper>
  );
}

const mapStateToProps = createStructuredSelector({
  pin: makeSelectOptionsPin(),
  star: makeSelectOptionsStar(),
  order: makeSelectOptionsOrder(),
})

export function mapDispatchToProps(dispatch) {
  return {
    onSkipRewind: () => dispatch(setSkipRewind()),
    onSetPin: (pin) => dispatch(setMediaPin(pin)),
    onSetStar: (star) => dispatch(setMediaStar(star)),
    onSetOrder: (order) => dispatch(setMediaOrder(order)),
    onSkipForward: () => dispatch(setSkipForward()),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
