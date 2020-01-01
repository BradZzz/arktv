/* eslint no-console: ["error", { allow: ["info","error"] }] */
/*
 * SettingsPage
 *
 * All the settings are here
 */
import React, { memo } from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { GoogleLogout } from 'react-google-login';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';

import H1 from 'components/H1';
import Button from '@material-ui/core/Button';
import messages from './messages';
import { unloadState } from '../../store/localStorage';
import Grid from '@material-ui/core/Grid';
import {
  syncUpdate,
} from '../ViewerPage/actions';

function SettingsPage(props) {
  const { onUpdateMedia } = props

  const logout = response => {
    try {
      console.info(response);
      unloadState();
      window.location.reload(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Settings Page</title>
        <meta
          name="description"
          content="Settings page of React.js Boilerplate application"
        />
      </Helmet>
      <H1>
        <FormattedMessage {...messages.header} />
      </H1>
      <Grid container direction="column">
        <Grid item>
        <Button variant="contained" color="primary" onClick={onUpdateMedia} style={{ margin: '1em 0' }}>
          Sync Media
        </Button>
        </Grid>
        <Grid item>
        <GoogleLogout
          clientId="1095795417803-8qaafo9b88j3kt61csjsi9mnkrjf037o.apps.googleusercontent.com"
          buttonText="Logout"
          onLogoutSuccess={logout}
        />
        </Grid>
      </Grid>
    </div>
  );
}

SettingsPage.propTypes = {
  onUpdateMedia: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({

});

export function mapDispatchToProps(dispatch) {
  return {
    onUpdateMedia: () => dispatch(syncUpdate()),
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsPage);
