import { takeEvery, call, select, put, all } from 'redux-saga/effects';
import axios from 'axios';
import { push } from 'connected-react-router/immutable';
import { selectAddInventoryDomain } from './selectors';
import { selectRestaurantDashboardDomain } from '../RestaurantDashboard/selectors';
import { SEND_QUERY, SAVE_INV_TO_DB } from './constants';
import { updateDropdownOption, redirect } from './actions';

export default function* inventorySaga() {
  yield all([
    takeEvery(SEND_QUERY, getUSDA),
    takeEvery(SAVE_INV_TO_DB, saveInventoryToDB),
  ]);
}

function* getUSDA() {
  const { searchTerm } = yield select(selectAddInventoryDomain);

  const options = {
    url: '/api/inventory/usdaSearch',
    method: 'post',
    data: { searchTerm },
  };

  try {
    const res = yield call(axios, options);
    yield put(updateDropdownOption(res.data));
  } catch (e) {
    yield console.error(e);
  }
}

function* saveInventoryToDB() {
  const { addedIngredients } = yield select(selectAddInventoryDomain);
  const { selectedRestaurant } = yield select(selectRestaurantDashboardDomain);
  const options = {
    url: '/api/inventory/addIngToDB',
    method: 'post',
    data: { ingObj: addedIngredients, id: selectedRestaurant },
  };

  try {
    yield call(axios, options);
    yield put(redirect());
    yield put(push('/inventory'));
  } catch (e) {
    yield console.error(e);
  }
}
