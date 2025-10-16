import { listAllSecretsFor } from './providerTemplates'

export function generateDopplerSetCommands({ project = 'my-project', config = 'production', providers = [] }) {
  const secrets = listAllSecretsFor(providers)
  return secrets.map((s) => ({
    key: s.key,
    required: !!s.required,
    command: `doppler secrets set "${s.key}=" --project ${project} --config ${config}`,
    sample: s.sample,
    provider: s.provider,
  }))
}

export function generateDotenvExample(providers) {
  const secrets = listAllSecretsFor(providers)
  return secrets
    .map((s) => `${s.key}=${s.sample}`)
    .join('\n')
}



