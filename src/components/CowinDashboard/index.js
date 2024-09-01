import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationCoverage from '../VaccinationCoverage'
import './index.css'

const fetchStates = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

export default class CowinDashboard extends Component {
  state = {
    data: null,
    fetchStatus: fetchStates.initial,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({fetchStatus: fetchStates.loading})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const jsonResponse = await response.json()
      const data = {
        last7DaysVaccination: jsonResponse.last_7_days_vaccination.map(day => ({
          vaccineDate: day.vaccine_date,
          dose1: day.dose_1,
          dose2: day.dose_2,
        })),
        vaccinationByGender: jsonResponse.vaccination_by_gender,
        vaccinationByAge: jsonResponse.vaccination_by_age,
      }
      this.setState({fetchStatus: fetchStates.success, data})
    } else {
      this.setState({fetchStatus: fetchStates.failure})
    }
  }

  renderData = () => {
    const {fetchStatus, data} = this.state
    switch (fetchStatus) {
      case fetchStates.success:
        return (
          <>
            <VaccinationCoverage data={data.last7DaysVaccination} />
            <VaccinationByGender data={data.vaccinationByGender} />
            <VaccinationByAge data={data.vaccinationByAge} />
          </>
        )
      case fetchStates.failure:
        return (
          <>
            <img
              src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
              alt="failure view"
              className="failure-img"
            />
            <h1>Something went wrong</h1>
          </>
        )
      case fetchStates.loading:
        return (
          <div data-testid="loader" className="loader">
            <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
          </div>
        )
      default:
        return ''
    }
  }

  render() {
    return (
      <div className="mc">
        <div className="logo-div">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="logo"
          />
          <h1 className="logo-text">Co-WIN</h1>
        </div>
        <h1 className="main-head">CoWIN Vaccination in India</h1>
        {this.renderData()}
      </div>
    )
  }
}
