import React from 'react'
import PropTypes from 'prop-types'
import { Translate } from 'react-redux-i18n'

import HomeLink from '../home-link'

import { routes } from '../../constants'
import { getGreetingTime } from '../../utils/date-helper'

import './styles.scss'

const Home = ({ firstname }) => (
  <div key="home" className="home-page">
    <div className="header">
      <h1>
        <Translate value={`home.welcome.${getGreetingTime()}`} firstname={firstname} />
      </h1>
      <div className="settings">
        <span>U</span>
        <span>R</span>
      </div>
    </div>
    <div className="links-container">
      {routes.filter(route => route.displayHome).map(link => (
        <HomeLink
          key={link.key}
          image={link.image}
          string={link.key}
          url={link.path}
        />
      ))}
    </div>
  </div>
)

Home.propTypes = {
  firstname: PropTypes.string,
}

Home.defaultProps = {
  firstname: '',
}

export default Home
