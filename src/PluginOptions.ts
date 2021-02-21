interface Permissions {
  [name: string]: {
    read: boolean
    write: boolean
    edit: boolean
    delete: boolean
  }
}

interface PluginOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  permissionsFunc(credentials: any): Permissions
}

export default PluginOptions
