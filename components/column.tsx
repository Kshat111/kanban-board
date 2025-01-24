"use client"

import { Droppable } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Task } from "./task"
import type { Column as ColumnType, Task as TaskType } from "../types/board"

interface ColumnProps {
  column: ColumnType
  tasks: TaskType[]
  onAddTask: (columnId: string) => void
  onEditTask: (task: TaskType) => void
  onDeleteTask: (taskId: string) => void
}

export function Column({ column, tasks, onAddTask, onEditTask, onDeleteTask }: ColumnProps) {
  return (
    <div className="flex w-full flex-col rounded-lg bg-card p-3 shadow-md transition-all duration-300 ease-in-out hover:shadow-lg md:w-80">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-semibold text-card-foreground">{column.title}</h2>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 rounded-full p-0 hover:bg-accent hover:text-accent-foreground"
          onClick={() => onAddTask(column.id)}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-grow rounded-md bg-accent/50 p-2 transition-colors duration-200 ${
              snapshot.isDraggingOver ? "bg-accent" : ""
            }`}
          >
            {tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} onEdit={onEditTask} onDelete={onDeleteTask} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}

