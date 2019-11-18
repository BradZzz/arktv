import { all } from 'redux-saga/effects';
import mediaSagas from './media';

export default function* rootSaga() {
  yield all([mediaSagas()]);
}
