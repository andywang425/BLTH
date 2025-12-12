import { Info, Tasks, TaskStatus } from '@/components/icons'

declare module 'vue' {
  export interface GlobalComponents {
    Info: typeof Info
    Tasks: typeof Tasks
    TaskStatus: typeof TaskStatus
  }
}
