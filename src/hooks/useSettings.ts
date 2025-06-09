import { useArtifact, useExists, useJson } from '@artifact/client/hooks'
import { useEffect, useState, useCallback } from 'react'
import {
  settingsSchema,
  type SettingsData,
  type Remote,
  type Napp
} from '../types/settings.ts'

export const defaultData: SettingsData = {
  remotes: [
    {
      id: '1',
      name: 'origin',
      url: 'https://github.com/user/repo.git',
      type: 'both',
      isDefault: true
    }
  ],
  permissions: [
    { id: '1', name: 'Read Files', type: 'read', scope: 'file' },
    { id: '2', name: 'Write Files', type: 'write', scope: 'file' },
    { id: '3', name: 'Merge Branches', type: 'write', scope: 'branch' },
    { id: '4', name: 'Admin Access', type: 'admin', scope: 'repo' }
  ],
  roles: [
    {
      id: '1',
      name: 'Viewer',
      description: 'Can view files and branches',
      permissions: ['1'],
      isInherited: false
    },
    {
      id: '2',
      name: 'Developer',
      description: 'Can modify files and create branches',
      permissions: ['1', '2', '3'],
      isInherited: false
    },
    {
      id: '3',
      name: 'Admin',
      description: 'Full access to repository',
      permissions: ['1', '2', '3', '4'],
      isInherited: true,
      inheritedFrom: 'Global Settings'
    }
  ],
  napps: [
    {
      id: '1',
      name: 'Code Formatter',
      description: 'Automatically formats code on commit',
      version: '1.2.0',
      isEnabled: true,
      installDate: '2023-01-15'
    },
    {
      id: '2',
      name: 'Security Scanner',
      description: 'Scans code for vulnerabilities',
      version: '2.0.1',
      isEnabled: true,
      installDate: '2023-02-10'
    },
    {
      id: '3',
      name: 'Documentation Generator',
      description: 'Generates documentation from comments',
      version: '1.0.5',
      isEnabled: false,
      installDate: '2023-03-05'
    }
  ]
}

export default function useSettings() {
  const artifact = useArtifact()
  const exists = useExists('settings.json')
  const raw = useJson('settings.json')
  const [data, setData] = useState<SettingsData>(defaultData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (exists === null) return
    if (exists === false) {
      artifact.files.write.json('settings.json', defaultData)
      artifact.branch.write.commit('Initialize settings')
      setData(defaultData)
      setLoading(false)
    } else if (raw !== undefined) {
      try {
        setData(settingsSchema.parse(raw))
      } catch {
        setData(defaultData)
      }
      setLoading(false)
    }
  }, [exists, raw, artifact])

  const save = useCallback(
    (next: SettingsData) => {
      setData(next)
      artifact.files.write.json('settings.json', next)
      artifact.branch.write.commit('Update settings')
    },
    [artifact]
  )

  const addRemote = (name: string, url: string) => {
    if (!name.trim() || !url.trim()) return
    const newRemote: Remote = {
      id: Date.now().toString(),
      name,
      url,
      type: 'both',
      isDefault: false
    }
    save({ ...data, remotes: [...data.remotes, newRemote] })
  }

  const removeRemote = (id: string) => {
    save({ ...data, remotes: data.remotes.filter((r) => r.id !== id) })
  }

  const addNapp = (name: string) => {
    if (!name.trim()) return
    const newNapp: Napp = {
      id: Date.now().toString(),
      name,
      description: 'New application',
      version: '1.0.0',
      isEnabled: true,
      installDate: new Date().toISOString().split('T')[0]
    }
    save({ ...data, napps: [...data.napps, newNapp] })
  }

  const toggleNappStatus = (id: string) => {
    save({
      ...data,
      napps: data.napps.map((n) =>
        n.id === id ? { ...n, isEnabled: !n.isEnabled } : n
      )
    })
  }

  return {
    ...data,
    loading,
    addRemote,
    removeRemote,
    addNapp,
    toggleNappStatus
  }
}
