/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.components.Header';

export default defineMessages({
  home: {
    id: `${scope}.home`,
    defaultMessage: 'Updates',
  },
  viewer: {
    id: `${scope}.viewer`,
    defaultMessage: 'Viewer',
  },
  features: {
    id: `${scope}.features`,
    defaultMessage: 'Settings',
  },
});
