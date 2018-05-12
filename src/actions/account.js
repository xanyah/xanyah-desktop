import { updateUserField } from '../actions'
import { updateUserParams as apiPatchUserParams } from '../utils/api-helper'
import { USER_UPDATE_USER } from '../constants/actions'
import {
  setLocale,
} from 'react-redux-i18n'

export const updateUser = user => ({
  type: USER_UPDATE_USER,
  user,
})

export const updateUserParams = (params) =>
  dispatch => {
    dispatch(updateUserField('loading', true))
    apiPatchUserParams(params)
      .then(({data}) => {
        const user = data.data
        dispatch(updateUser(user))
        dispatch(setLocale(data.data.locale))
        dispatch(updateUserField('loading', false))
      })
  }
