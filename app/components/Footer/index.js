import React from 'react';
import { FormattedMessage } from 'react-intl';

import A from 'components/A';
import LocaleToggle from 'containers/LocaleToggle';
import Wrapper from './Wrapper';
import messages from './messages';
import Header from 'components/Header';

function Footer() {
  return (
    <Wrapper>
      <div style={{ width: '100%' }}>
        <Header/>
      </div>
    </Wrapper>
  );
}

export default Footer;
