import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Plugin } from 'vite'

const VIRTUAL_ID = 'virtual:licenses'
const RESOLVED_ID = `\0${VIRTUAL_ID}`
const ROOT_DIR = new URL('..', import.meta.url).pathname

interface PackageJson {
  readonly name: string
  readonly version: string
  readonly license?: string
  readonly dependencies?: Record<string, string>
}

interface LicenseEntry {
  readonly name: string
  readonly version: string
  readonly license: string
  readonly text: string
}

function readPackageJson(name: string): PackageJson {
  return JSON.parse(readFileSync(join(ROOT_DIR, 'node_modules', name, 'package.json'), 'utf-8')) as PackageJson
}

function readLicenseText(name: string): string {
  const dir = join(ROOT_DIR, 'node_modules', name)
  const file = readdirSync(dir).find((entry) => /^licen[cs]e(\.|$)/i.test(entry))
  return file && existsSync(join(dir, file)) ? readFileSync(join(dir, file), 'utf-8').trim() : ''
}

/** `dependencies` を再帰的にたどり、実行時に同梱されるパッケージのライセンスを集める */
function collectLicenses(): LicenseEntry[] {
  const root = JSON.parse(readFileSync(join(ROOT_DIR, 'package.json'), 'utf-8')) as PackageJson
  const seen = new Map<string, LicenseEntry>()
  const queue = Object.keys(root.dependencies ?? {})

  for (let name = queue.shift(); name !== undefined; name = queue.shift()) {
    if (seen.has(name)) continue
    const pkg = readPackageJson(name)
    seen.set(name, {
      name,
      version: pkg.version,
      license: pkg.license ?? 'UNKNOWN',
      text: readLicenseText(name),
    })
    queue.push(...Object.keys(pkg.dependencies ?? {}))
  }

  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name))
}

/** `virtual:licenses` として、利用しているOSSのライセンス一覧をビルド時に提供する */
export function licenses(): Plugin {
  return {
    name: 'licenses',
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : undefined
    },
    load(id) {
      return id === RESOLVED_ID ? `export default ${JSON.stringify(collectLicenses())}` : undefined
    },
  }
}
