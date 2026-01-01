export type Priority = 'high' | 'medium' | 'low'

export interface Todo {
  id: string
  title: string
  completed: boolean
  created_at: string
  priority: Priority
  due_date: string | null
  category: string | null
}

export interface TodoStats {
  total: number
  completed: number
  pending: number
  highPriority: number
}
