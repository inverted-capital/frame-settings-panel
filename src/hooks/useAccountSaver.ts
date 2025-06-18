import { useArtifact } from '@artifact/client/hooks'
import type { AccountData } from '../types/account.ts'

const useAccountSaver = () => {
  const artifact = useArtifact()

  if (!artifact) {
    return async (): Promise<void> => {
      // Artifact not ready; noop
    }
  }

  return async (data: AccountData): Promise<void> => {
    artifact.files.write.json('profile.json', data)
    await artifact.branch.write.commit('Update account data')
  }
}

export default useAccountSaver
