declare module "virtual:licenses" {
  export interface LicenseEntry {
    readonly name: string;
    readonly version: string;
    readonly license: string;
    readonly text: string;
  }
  const licenses: readonly LicenseEntry[];
  export default licenses;
}
