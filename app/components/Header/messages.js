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
    defaultMessage: 'Home',
  },
  viewer: {
    id: `${scope}.viewer`,
    defaultMessage: 'Viewer',
  },
  features: {
    id: `${scope}.features`,
    defaultMessage: 'Features',
  },
});
