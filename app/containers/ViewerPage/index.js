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
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import messages from './messages';

import { makeSelectCurrentMedia, makeSelectCurrentChannel } from './selectors';
import { checkMedia, checkNextMedia } from './actions';

export function ViewerPage(props) {
  const { selectedChannel, onCheckMedia, onSetMedia, selected } = props;

  onCheckMedia();

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
        <CastPlayer
          selected={selected}
          channel={selectedChannel}
          onSetMedia={onSetMedia}
        />
      </div>
    </div>
  );
}

ViewerPage.propTypes = {
  selectedChannel: PropTypes.object,
  selected: PropTypes.object,
  onCheckMedia: PropTypes.func,
  onSetMedia: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  selectedChannel: makeSelectCurrentChannel(),
  selected: makeSelectCurrentMedia(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onCheckMedia: () => dispatch(checkMedia()),
    onSetMedia: () => dispatch(checkNextMedia()),
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewerPage);
