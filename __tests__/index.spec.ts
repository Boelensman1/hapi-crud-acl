import HapiCrudACL, { PermissionsFuncMissingError } from '../src/'
import * as Hapi from '@hapi/hapi'

describe('Registration', () => {
  // it('The plugin registers', async () => {
  // it('The plugin registers', async () => {
  it('Should return an error if options.permissionsFunc is not a function', async () => {
    const server = new Hapi.Server()

    await server.register({
      plugin: HapiCrudACL,
      options: {
        permissionsFunc: 123,
      },
    })
  })
})

describe('Implementation', () => {
  it('Should error when permissions function is missig', async () => {
    const server = new Hapi.Server()

    const register = () => {
      return server.register({
        plugin: HapiCrudACL,
        options: {},
      })
    }
    await expect(register()).rejects.toThrow(PermissionsFuncMissingError)
  })

  it('If plugin is not active on a route, the route should give access', async () => {
    const server = new Hapi.Server()

    const permissionsFunc = () => ({})

    await server.register({
      plugin: HapiCrudACL,
      options: {
        permissionsFunc,
      },
    })

    const handler = async (_request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      return h.response('hoi')
    }

    server.route({
      method: 'GET',
      path: '/plugin-not-active',
      options: {
        handler,
        tags: ['api', 'tasks'],
        description: 'Get task by id.',
      },
    })

    const res = await server.inject({
      method: 'GET',
      url: '/plugin-not-active',
    })
    expect(res.statusCode).toBe(200)
  })

  it('Should give access', async () => {
    const server = new Hapi.Server()

    const permissionsFunc = () => {
      return {
        cars: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
      }
    }

    await server.register({
      plugin: HapiCrudACL,
      options: {
        permissionsFunc,
      },
    })

    const handler = async (_request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      return h.response('hoi')
    }

    server.route({
      method: 'GET',
      path: '/unprotected',
      options: {
        handler,
        tags: ['api', 'tasks'],
        description: 'Get task by id.',
        plugins: {
          hapiCrudAcl: {
            permissions: [], // no required permissions
          },
        },
      },
    })

    const res = await server.inject({
      method: 'GET',
      url: '/unprotected',
    })
    expect(res.statusCode).toBe(200)
  })

  it('Should not give access', async () => {
    const server = new Hapi.Server()

    const permissionsFunc = () => {
      return {
        cars: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
      }
    }

    await server.register({
      plugin: HapiCrudACL,
      options: {
        permissionsFunc,
      },
    })

    const handler = async (_request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      return h.response('hoi')
    }

    server.route({
      method: 'GET',
      path: '/protected',
      options: {
        handler,
        tags: ['api', 'tasks'],
        description: 'Get task by id.',
        plugins: {
          hapiCrudAcl: {
            permissions: ['cars:read', 'trucks:update'],
          },
        },
      },
    })

    const res = await server.inject({
      method: 'GET',
      url: '/protected',
    })
    expect(res.statusCode).toBe(401)
  })
  it('Should not give access', async () => {
    const server = new Hapi.Server()

    const permissionsFunc = () => {
      return {
        cars: {
          create: true,
          read: false,
          update: true,
          delete: true,
        },
      }
    }

    await server.register({
      plugin: HapiCrudACL,
      options: {
        permissionsFunc,
      },
    })

    const handler = async (_request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      return h.response('hoi')
    }

    server.route({
      method: 'GET',
      path: '/protected',
      options: {
        handler,
        tags: ['api', 'tasks'],
        description: 'Get task by id.',
        plugins: {
          hapiCrudAcl: {
            permissions: ['cars:read'],
          },
        },
      },
    })

    const res = await server.inject({
      method: 'GET',
      url: '/protected',
    })
    expect(res.statusCode).toBe(401)
  })
  it('Should give access', async () => {
    const server = new Hapi.Server()

    const permissionsFunc = () => {
      return {
        cars: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
      }
    }

    await server.register({
      plugin: HapiCrudACL,
      options: {
        permissionsFunc,
      },
    })

    const handler = async (_request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      return h.response('hoi')
    }

    server.route({
      method: 'GET',
      path: '/protected',
      options: {
        handler,
        tags: ['api', 'tasks'],
        description: 'Get task by id.',
        plugins: {
          hapiCrudAcl: {
            permissions: ['cars:read'],
          },
        },
      },
    })

    const res = await server.inject({
      method: 'GET',
      url: '/protected',
    })
    expect(res.statusCode).toBe(200)
  })
})
