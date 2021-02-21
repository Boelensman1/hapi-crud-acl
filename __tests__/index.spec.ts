import HapiCrudACL from '../src/'
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
  // it('The plugin registers', async () => {
  // it('The plugin registers', async () => {
  it('Should give access', async () => {
    const server = new Hapi.Server()

    const permissionsFunc = () => {
      return {
        cars: {
          read: true,
          write: true,
          edit: true,
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
      path: '/unprotected2',
      options: {
        handler,
        tags: ['api', 'tasks'],
        description: 'Get task by id.',
        plugins: {
          hapiCrudAcl: {
            permissions: [],
          },
        },
      },
    })

    const res = await server.inject({
      method: 'GET',
      url: '/unprotected2',
    })
    expect(res.statusCode).toBe(200)
  })

  it('Should not give access', async () => {
    const server = new Hapi.Server()

    const permissionsFunc = () => {
      return {
        cars: {
          read: true,
          write: true,
          edit: true,
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
            permissions: ['cars:read', 'trucks:write'],
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
          read: false,
          write: true,
          edit: true,
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
          read: true,
          write: true,
          edit: true,
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
