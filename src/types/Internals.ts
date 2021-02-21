import * as Hapi from '@hapi/hapi'
import PermissionsFunc from './PermissionsFunc'

interface Internals {
  implementation: (request: Hapi.Request, h: Hapi.ResponseToolkit) => any
  permissionsFunc: PermissionsFunc
}

export default Internals
