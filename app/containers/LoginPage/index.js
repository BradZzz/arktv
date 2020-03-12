/* eslint no-console: ["error", { allow: ["error"] }] */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import GoogleLogin from 'react-google-login';
import { push } from 'connected-react-router';

import { updateLogin, updateToken } from './actions';

export function LoginPage(props) {
  const { onUpdateLogin, onUpdateToken, redirectLogin, login } = props;

  if (
    !(
      login === undefined ||
      (Object.entries(login).length === 0 && login.constructor === Object)
    )
  ) {
    redirectLogin('/');
  }

  const responseGoogle = response => {
    try {
      console.log('responseGoogle', response);
      onUpdateToken(response.tokenId);
      onUpdateLogin(response.profileObj);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <GoogleLogin
        clientId="1095795417803-8qaafo9b88j3kt61csjsi9mnkrjf037o.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy="single_host_origin"
        scope="profile email https://www.googleapis.com/auth/cloud-platform"
      />
    </div>
  );
}

LoginPage.propTypes = {
  login: PropTypes.object,
  onUpdateLogin: PropTypes.func,
  onUpdateToken: PropTypes.func,
  redirectLogin: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({});

export function mapDispatchToProps(dispatch) {
  return {
    onUpdateLogin: creds => dispatch(updateLogin(creds)),
    onUpdateToken: tkn => dispatch(updateToken(tkn)),
    redirectLogin: path => dispatch(push(path)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(LoginPage);
