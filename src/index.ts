import * as Hapi from '@hapi/hapi'
import * as Boom from '@hapi/boom' // error handling
import * as pkg from '../package.json'

import PluginOptions from './PluginOptions'

const internals = {
  implementation: null,
  permissionsFunc: null,
} // see: http://hapijs.com/styleguide#module-globals

exports.plugin = {
  register: (server: Hapi.Server, options: PluginOptions) => {
    if (!options.permissionsFunc) {
      throw Error('permissionsFunc is required')
    }
    internals.permissionsFunc = options.permissionsFunc
    server.ext({ type: 'onPostAuth', method: internals.implementation })
  },
}

/**
 * attributes merely aliases the package.json (re-uses package name & version)
 * simple example: github.com/hapijs/hapi/blob/master/API.md#serverplugins
 */
exports.plugin.pkg = pkg // hapi requires attributes for a plugin.
// also see: http://hapijs.com/tutorials/plugins
//

const name = 'hapiCrudAcl'

/**
 * specify peer dependency on hapi, enforced by hapi at runtime
 */
exports.plugin.requirements = {
  hapi: '>=19',
}

const hasPermission = (required: any, has: any) => {
  return required
    .map((permission: string) => permission.split(':'))
    .every(([name, crud]: [string, string]): boolean => {
      if (!has[name]) {
        return false
      }
      return has[name][crud]
    })
}

internals.implementation = async (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) => {
  const settings = request.route.settings.plugins[name]
  // check if the plugin is active on this route
  if (!settings) {
    return h.continue
  }

  const requiredPermissions = settings.permissions
  // check if we have permissions set
  if (!requiredPermissions) {
    return h.continue
  }

  // call the permissionsfunction to get our current permissions
  const { credentials } = request.auth
  const userPermissions = await internals.permissionsFunc(credentials)
  if (hasPermission(requiredPermissions, userPermissions)) {
    return h.continue
  } else {
    throw Boom.unauthorized('Access denied')
  }
}

export default exports.plugin
