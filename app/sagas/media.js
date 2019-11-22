import { push } from 'connected-react-router';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { updateMedia, setMediaSignedUrl } from '../containers/ViewerPage/actions';
import { CHECK_MEDIA, SET_SELECTED_MEDIA } from '../containers/ViewerPage/constants';
import { makeSelectMedia, makeSelectCurrentMedia } from '../containers/ViewerPage/selectors';

import mediaApi from '../utils/mediaApi';

export function* requestMedia() {
  try {
    console.log("requestMedia")
    const reqSuf = `get_media`

    const resp = yield call(mediaApi.get, reqSuf);
    console.log("resp", resp)
    const currentMedia = yield select(makeSelectMedia());
    if (currentMedia.length === 0) {
      yield put(updateMedia(resp.data));
    }
  } catch (err) {
    //    console.log('err', err);
  }
}

export function* requestSignedURl() {
  try {
    console.log("requestSignedURl")
    const currentMedia = yield select(makeSelectCurrentMedia());
    console.log("currentMedia:", currentMedia)

    const reqSuf = `signed_url?path=${currentMedia.path}`

    const resp = yield call(mediaApi.get, reqSuf);
    console.log("resp", resp)
    yield put(setMediaSignedUrl(resp.data));
//    const currentMedia = yield select(makeSelectMedia());
//    if (currentMedia.length === 0) {
//      yield put(updateMedia(resp.data));
//    }
  } catch (err) {
    //    console.log('err', err);
  }
}

export default function* mediaSagas() {
  console.log("mediaSagas")
  yield takeLatest(CHECK_MEDIA, requestMedia);
  yield takeLatest(SET_SELECTED_MEDIA, requestSignedURl);
}
