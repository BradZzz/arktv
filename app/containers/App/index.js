/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { memo } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';

import HomePage from 'containers/HomePage/Loadable';
import ViewerPage from 'containers/ViewerPage/Loadable';
import SettingsPage from 'containers/SettingsPage/Loadable';
import LoginPage from 'containers/LoginPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Footer from 'components/Footer';

import GlobalStyle from '../../global-styles';
import { makeSelectLoginInfo } from '../LoginPage/selectors';

const AppWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  flex-direction: column;
`;

function App(props) {
  const { location, login } = props;

  console.log('login', login);

  /* eslint-disable-next-line react/prop-types */
  const PrivateRoute = ({ component: Component, ...rest }) => {
    const no = (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: location },
        }}
      />
    );

    const yes = <Component {...props} />;

    const view =
      login === undefined ||
      (Object.entries(login).length === 0 && login.constructor === Object)
        ? no
        : yes;

    return <Route {...rest} render={() => view} />;
  };

  const showFooter =
    login === undefined ||
    (Object.entries(login).length === 0 && login.constructor === Object);
  const footerView = showFooter ? <></> : <Footer />;

  return (
    <AppWrapper>
      <Helmet
        titleTemplate="%s - React.js Boilerplate"
        defaultTitle="React.js Boilerplate"
      >
        <meta name="description" content="A React.js Boilerplate application" />
      </Helmet>
      <div style={{ padding: '2em' }}>
        <Switch>
          <PrivateRoute exact path="/" component={HomePage} />
          <PrivateRoute path="/viewer" component={ViewerPage} />
          <PrivateRoute path="/settings" component={SettingsPage} />
          <Route path="/login" component={() => <LoginPage login={login} />} />
          <Route path="" component={NotFoundPage} />
        </Switch>
      </div>
      {footerView}
      <GlobalStyle />
    </AppWrapper>
  );
}

App.propTypes = {
  location: PropTypes.string,
  login: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  login: makeSelectLoginInfo(),
});

export function mapDispatchToProps() {
  return {};
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(App);
