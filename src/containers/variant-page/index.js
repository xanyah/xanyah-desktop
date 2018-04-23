import { connect } from 'react-redux'
import VariantPage from '../../components/variant-page'
import {
  createApiVariantAttribute,
  updateGlobalField,
  updateProductsField,
  updateApiVariant,
  updateApiVariantAttribute,
} from '../../actions'

const mapStateToProps = (
  {
    products: {
      loading,
      selectedProduct,
      selectedVariant,
      variantAttributeEditing,
      variantEditing,
      variants,
    }}) => ({
  loading,
  selectedProduct,
  selectedVariant,
  variantAttributeEditing,
  variantEditing,
  variants,
})

const mapDispatchToProps = dispatch => ({
  createApiVariantAttribute: newVariantAttribute =>
    dispatch(createApiVariantAttribute(newVariantAttribute)),
  dispatch,
  setPageName: name =>
    dispatch(updateGlobalField('currentNavigationStep', name)),
  updateApiVariant: updatedVariant =>
    dispatch(updateApiVariant(updatedVariant)),
  updateApiVariantAttribute: updatedVariantAttribute =>
    dispatch(updateApiVariantAttribute(updatedVariantAttribute)),
  updateProductsField: (field, value) =>
    dispatch(updateProductsField(field, value)),
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...dispatchProps,
  ...ownProps,
  ...stateProps,
  toggleVariant: () =>
    dispatchProps.dispatch(updateProductsField('variantEditing', !stateProps.variantEditing)),
  toggleVariantAttribute: () =>
    dispatchProps.dispatch(updateProductsField('variantAttributeEditing', !stateProps.variantAttributeEditing)),
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(VariantPage)