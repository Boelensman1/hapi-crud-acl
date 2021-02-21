# Hapi Route ACL

Fine-grained route access control based on CRUD for [hapi.js](http://hapijs.com/)

![Build Status](https://github.com/boelensman1/hapi-crud-acl/actions/workflows/main.yml/badge.svg)
[![codecov](https://codecov.io/gh/Boelensman1/hapi-crud-acl/branch/master/graph/badge.svg?token=RK613MNQDW)](https://codecov.io/gh/Boelensman1/hapi-crud-acl)

## Description

This hapi.js plugin allows you to specify ACL permission requirements for each of your routes using CRUD. For example let's say you have a resource called "cars". You could protect each route with the following permissions:

`'cars:create'`, `'cars:read'`, `'cars:update'`, `'cars:delete'`

Routes can be protected by multiple permissions. For example you might have a route for drivers of cars that looks like: `POST /cars/1/drivers/`

You can protect this route with: `['drivers:create', 'cars:read']`

### Hapi-Route-ACL

This project is a rewrite of [hapi-route-acl](https://github.com/eventhough/hapi-route-acl) to which I give great thanks for the inspiration. This readme is also stolen (with a few changes where applicable) from that project.

## Usage

### Example

```javascript
const hapi = require('@hapi/hapi')
const hapiCrudAcl = require('hapi-crud-acl')

// gets the permissions that the user has from the request
// its only argument is the value of request.auth.credentials
// which should be set by your authentication solution
const permissionsFunc = (auth) => {
  return auth.permissions
}

// server.js
var server = new hapi.Server()

server.register({
  plugin: hapiCrudAcl,
  options: {
    permissionsFunc,
  },
})

server.route([
  {
    method: 'GET',
    path: '/unprotected',
    config: {
      handler: (request, reply) => {
        reply('hoi')
      },
    },
  },
  {
    method: 'GET',
    path: '/cars',
    config: {
      handler: (request, reply) => {
        reply(['Toyota Camry', 'Honda Accord', 'Ford Fusion'])
      },
      plugins: {
        hapiCrudAcl: {
          permissions: ['cars:read'],
        },
      },
    },
  },
  {
    method: 'GET',
    path: '/cars/{id}',
    config: {
      handler: (request, reply) => {
        reply('Toyota Camry')
      },
      plugins: {
        hapiCrudAcl: {
          permissions: 'cars:read',
        },
      },
    },
  },
  {
    method: 'DELETE',
    path: '/cars/{id}',
    config: {
      handler: (request, reply) => {
        reply('car deleted!')
      },
      plugins: {
        hapiCrudAcl: {
          permissions: ['cars:delete'],
        },
      },
    },
  },
  {
    method: 'GET',
    path: '/cars/{id}/drivers',
    config: {
      handler: (request, reply) => {
        reply(['Greg', 'Tom', 'Sam'])
      },
      plugins: {
        hapiCrudAcl: {
          permissions: ['cars:read', 'drivers:read'],
        },
      },
    },
  },
  {
    method: 'DELETE',
    path: '/cars/{carId}/drivers/{driverId}',
    config: {
      handler: (request, reply) => {
        reply('driver deleted!')
      },
      plugins: {
        hapiRouteAcl: {
          permissions: ['cars:read', 'drivers:delete'],
        },
      },
    },
  },
])

server.start()
```

This plugin requires a permissionsFunc which takes credentials (from request.auth.credentials) and returns the permissions or a promise resolving to the permissions

The permission format should look something like this:

```javascript
{
  cars: {
    create: false,
    read: true,
    update: true,
    delete: true
  },
  drivers: {
    create: false,
    read: true,
    update: false,
    delete: false
  }
};
```

Keys are route names and values are objects that map each crud type to a boolean for access. Note that while create/read/update/delete is the recommended format it is not required. You could for example also make permissions that look like this:

```javascript
{
  cars: {
    make: true,
    look: true,
    edit: true,
    remove: true
    duplicate: true
    retract: true
  },
};
```
