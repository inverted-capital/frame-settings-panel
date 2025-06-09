import { z } from 'zod'

export const remoteSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  type: z.union([z.literal('fetch'), z.literal('push'), z.literal('both')]),
  isDefault: z.boolean()
})
export type Remote = z.infer<typeof remoteSchema>

export const permissionSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.union([z.literal('read'), z.literal('write'), z.literal('admin')]),
  scope: z.union([z.literal('file'), z.literal('branch'), z.literal('repo')])
})
export type Permission = z.infer<typeof permissionSchema>

export const roleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  permissions: z.array(z.string()),
  isInherited: z.boolean(),
  inheritedFrom: z.string().optional()
})
export type Role = z.infer<typeof roleSchema>

export const nappSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  version: z.string(),
  isEnabled: z.boolean(),
  installDate: z.string()
})
export type Napp = z.infer<typeof nappSchema>

export const settingsSchema = z.object({
  remotes: z.array(remoteSchema),
  permissions: z.array(permissionSchema),
  roles: z.array(roleSchema),
  napps: z.array(nappSchema)
})
export type SettingsData = z.infer<typeof settingsSchema>
