import { Info, Tasks, TaskStatus } from '@/components/icons'

declare module 'vue' {
  interface GlobalComponents {
    Info: typeof Info
    Tasks: typeof Tasks
    TaskStatus: typeof TaskStatus
  }
}

export {}
