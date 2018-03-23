import {
  MANUFACTURERS_UPDATE_MANUFACTURER,
  MANUFACTURERS_UPDATE_FIELD,
} from '../constants/actions'

import { I18n } from 'react-redux-i18n'

import {
  getManufacturers as apiGetManufacturers,
  updateManufacturer as apiPatchManufacturerParams,
  createManufacturer as apiPostManufacturer,
} from '../utils/api-helper'

import {
  showSuccessToast,
} from '../utils/notification-helper'

import { formatManufacturer } from '../types'

export const updateManufacturer = manufacturer => ({
  manufacturer,
  type: MANUFACTURERS_UPDATE_MANUFACTURER,
})

export const updateManufacturerField = (field, value) => ({
  field,
  type: MANUFACTURERS_UPDATE_FIELD,
  value,
})

export const getManufacturers = () =>
  (dispatch, currentState) => {
    const state = currentState()
    dispatch(updateManufacturerField('loading', true))
    apiGetManufacturers({ storeId: state.stores.currentStore.id })
      .then(({ data }) => {
        dispatch(updateManufacturerField('manufacturers', data))
        dispatch(updateManufacturerField('loading', false))
      })
  }

export const updateApiManufacturer = updatedManufacturer =>
  dispatch => {
    updatedManufacturer = formatManufacturer(updatedManufacturer)
    dispatch(updateManufacturerField('loading', true))
    apiPatchManufacturerParams(updatedManufacturer.id, updatedManufacturer)
      .then(({ data }) => {
        dispatch(updateManufacturerField('loading', false))
        dispatch(updateManufacturer(data))
        showSuccessToast(I18n.t('toast.updated'))
      })
  }

//TODO update currentManufacturer ? after creation ?
export const createApiManufacturer = newManufacturer =>
  (dispatch, currentState) => {
    const state = currentState()

    if(state && state.stores && state.stores.currentStore) {
      const storeId = state.stores.currentStore.id
      newManufacturer = formatManufacturer(newManufacturer)
      dispatch(updateManufacturerField('loading', true))
      apiPostManufacturer({...newManufacturer, storeId})
        .then(({ data }) => {
          dispatch(updateManufacturerField('loading', false))
          dispatch(updateManufacturer(data))
        })
    }
  }
