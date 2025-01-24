export interface Task {
  id: string
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  status: "todo" | "in-progress" | "done"
}

export interface Column {
  id: string
  title: string
  taskIds: string[]
}

export interface Board {
  id: string
  name: string
  tasks: { [key: string]: Task }
  columns: { [key: string]: Column }
  columnOrder: string[]
}

