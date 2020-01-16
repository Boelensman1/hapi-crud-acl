interface Permissions {
  [name: string]: {
    read: boolean
    write: boolean
    edit: boolean
    delete: boolean
  }
}

interface PluginOptions {
  permissionsFunc(credentials: any): Permissions
}

export default PluginOptions
