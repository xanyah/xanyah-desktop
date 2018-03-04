import {
  MANUFACTURERS_UPDATE_MANUFACTURER,
  MANUFACTURERS_UPDATE_FIELD,
} from '../constants/actions'

import {
  getManufacturers as apiGetManufacturers,
  updateManufacturer as apiPatchManufacturerParams,
} from '../utils/api-helper'

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
  dispatch => {
    dispatch(updateManufacturerField('loading', true))
    apiGetManufacturers()
      .then(({ data }) => {
        dispatch(updateManufacturerField('manufacturers', data))
        dispatch(updateManufacturerField('loading', false))
      })
  }

export const updateManufacturerParams = (id, params) =>
  dispatch => {
    dispatch(updateManufacturerField('loading', true))
    apiPatchManufacturerParams(id, params)
      .then(({ data }) => {
        dispatch(updateManufacturerField('loading', false))
        dispatch(updateManufacturer(data))
      })
  }
