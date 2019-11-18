import { push } from 'connected-react-router';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { updateMedia } from '../containers/ViewerPage/actions';
import { CHECK_MEDIA } from '../containers/ViewerPage/constants';

import mediaApi from '../utils/mediaApi';

export function* requestMedia() {
  try {
    console.log("requestMedia")
    const reqSuf = `get_media`

    const resp = yield call(mediaApi.get, reqSuf);
    console.log("resp", resp)
//    yield put(SetUserSubs(resp.data.message));
  } catch (err) {
    // TODO: ivan.santos - report error to sentry
    //    console.log('err', err);
  }
}

export default function* mediaSagas() {
  console.log("mediaSagas")
  yield takeLatest(CHECK_MEDIA, requestMedia);
}
