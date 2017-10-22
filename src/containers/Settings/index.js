import {connect} from 'react-redux'
import Settings from './Settings'
import {updateSettings, updateProjection} from '../../actions'

const mapStateToProps = ({settings}) => ({settings})

export default connect(mapStateToProps, {updateSettings, updateProjection})(Settings)
