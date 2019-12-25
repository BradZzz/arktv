/* eslint no-console: ["error", { allow: ["info","error"] }] */
/*
 * SettingsPage
 *
 * All the settings are here
 */
import React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { GoogleLogout } from 'react-google-login';

import H1 from 'components/H1';
import messages from './messages';
import { unloadState } from '../../store/localStorage';

export default function SettingsPage() {
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
      <GoogleLogout
        clientId="1095795417803-8qaafo9b88j3kt61csjsi9mnkrjf037o.apps.googleusercontent.com"
        buttonText="Logout"
        onLogoutSuccess={logout}
      />
    </div>
  );
}
