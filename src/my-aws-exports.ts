import Amplify from 'aws-amplify'
import AmplifyConcig from './aws-exports'

export { AmplifyConcig }

export const configure = () => {
  Amplify.configure(AmplifyConcig)
}
