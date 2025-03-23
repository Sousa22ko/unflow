export interface FrictionMode {
  key: string,
  value: number
}

export const FRICTION_MODES: FrictionMode[] = [
  {
    key: "Sem friccão",
    value: 0
  },
  {
    key: "Friccão normal",
    value: 1
  },
  {
    key: "Friccão exponencial",
    value: 2
  }
]

export const DEFAULT_FRICTION_MODE: FrictionMode = FRICTION_MODES[0]