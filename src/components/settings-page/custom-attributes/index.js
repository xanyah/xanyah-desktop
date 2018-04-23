import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

import FormAttribute from '../../../containers/form-attribute'
import { CustomAttributeType } from '../../../types'
import DataTable from '../../data-table'
import { getTypeOptions } from '../../../utils/data-helper'

// import { Translate } from 'react-redux-i18n'

export default class CustomAttribute extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newCustomAttribute: {},
    }
  }

  handleUpdate(attribute, value) {
    this.setState({
      newCustomAttribute: {
        ...this.state.newCustomAttribute,
        [attribute]: value,
      },
    })
  }

  renderCustomAttributesForm() {
    const { createApiCustomAttribute } = this.props
    const { newCustomAttribute } = this.state
    return (
      <form
        className="custom-attribute-form"
        key="form"
        onSubmit={e=> {
          e.preventDefault()
          createApiCustomAttribute(newCustomAttribute)
        }}>

        <div className="row">
          <FormAttribute
            attribute="name"
            key="name"
            value={newCustomAttribute['name']}
            model="custom_attributes"
            type="string"
            onUpdate={(attribute, value) => this.handleUpdate(attribute, value)}
          />

          <Select
            // name="form-field-name"
            value={newCustomAttribute['type']}
            onChange={e => this.handleUpdate('type', e.value)}
            options={getTypeOptions()}
          />
        </div>

        <button className="btn-link btn-stand-alone" type="submit">Envoyer</button>
      </form>
    )
  }

  renderCustomAttributesList() {
    const { customAttributes, openCustomAttribute } = this.props
    return (
      <div className="custom_attributes" key="table">
        <h1>Voir les attributs personnalisés</h1>

        <DataTable
          columns={['name', 'type']}
          data={customAttributes}
          loading={false}
          onItemView={item => openCustomAttribute(item)}
          type="custom_attributes"
          create={false}
        />

      </div>
    )
  }

  render() {
    return [this.renderCustomAttributesForm(), this.renderCustomAttributesList()]
  }
}

CustomAttribute.propTypes = {
  createApiCustomAttribute: PropTypes.func,
  customAttributes: PropTypes.arrayOf(CustomAttributeType),
  getCustomAttributes: PropTypes.func,
  openCustomAttribute: PropTypes.func,
}

CustomAttribute.defaultProps = {
  createApiCustomAttribute: () =>  null,
  customAttributes: [],
  getCustomAttributes: () => null,
  openCustomAttribute: () => null,
}