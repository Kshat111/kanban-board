"use client"

import { DragDropContext, Droppable } from "@hello-pangea/dnd"
import { useState, useEffect } from "react"
import { Column } from "./column"
import { TaskDialog } from "./task-dialog"
import { Sidebar } from "./sidebar"
import { BoardHeader } from "./board-header"
import { ThemeToggle } from "./theme-toggle"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserAccountCreation } from "./user-account-creation"
import { CreateFirstBoard } from "./create-first-board"
import type { Board, Task } from "../types/board"

export default function KanbanBoard() {
  const [username, setUsername] = useState<string | null>(null)
  const [boards, setBoards] = useState<{ [key: string]: Board }>({})
  const [activeBoard, setActiveBoard] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeColumn, setActiveColumn] = useState<string | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  useEffect(() => {
    const storedUsername = localStorage.getItem("username")
    if (storedUsername) {
      setUsername(storedUsername)
      const storedBoards = localStorage.getItem("boards")
      if (storedBoards) {
        setBoards(JSON.parse(storedBoards))
        const storedActiveBoard = localStorage.getItem("activeBoard")
        if (storedActiveBoard) {
          setActiveBoard(storedActiveBoard)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (username) {
      localStorage.setItem("username", username)
    }
  }, [username])

  useEffect(() => {
    if (Object.keys(boards).length > 0) {
      localStorage.setItem("boards", JSON.stringify(boards))
    }
  }, [boards])

  useEffect(() => {
    if (activeBoard) {
      localStorage.setItem("activeBoard", activeBoard)
    }
  }, [activeBoard])

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result

    if (!destination || !activeBoard) return

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const board = boards[activeBoard]
    const start = board.columns[source.droppableId]
    const finish = board.columns[destination.droppableId]

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      }

      const newBoard = {
        ...board,
        columns: {
          ...board.columns,
          [newColumn.id]: newColumn,
        },
      }

      setBoards({
        ...boards,
        [activeBoard]: newBoard,
      })
      return
    }

    const startTaskIds = Array.from(start.taskIds)
    startTaskIds.splice(source.index, 1)
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    }

    const finishTaskIds = Array.from(finish.taskIds)
    finishTaskIds.splice(destination.index, 0, draggableId)
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    }

    const newBoard = {
      ...board,
      columns: {
        ...board.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    }

    setBoards({
      ...boards,
      [activeBoard]: newBoard,
    })
  }

  const handleAddTask = (columnId: string) => {
    setActiveColumn(columnId)
    setEditingTask(null)
    setDialogOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setDialogOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    if (!activeBoard) return

    const board = boards[activeBoard]
    const newTasks = { ...board.tasks }
    delete newTasks[taskId]

    const newColumns = Object.entries(board.columns).reduce(
      (acc, [columnId, column]) => ({
        ...acc,
        [columnId]: {
          ...column,
          taskIds: column.taskIds.filter((id) => id !== taskId),
        },
      }),
      {},
    )

    const newBoard = {
      ...board,
      tasks: newTasks,
      columns: newColumns,
    }

    setBoards({
      ...boards,
      [activeBoard]: newBoard,
    })
  }

  const handleTaskSubmit = (data: Partial<Task>) => {
    if (!activeBoard) return

    const board = boards[activeBoard]
    if (editingTask) {
      // Update existing task
      const newBoard = {
        ...board,
        tasks: {
          ...board.tasks,
          [editingTask.id]: {
            ...editingTask,
            ...data,
          },
        },
      }
      setBoards({
        ...boards,
        [activeBoard]: newBoard,
      })
    } else if (activeColumn) {
      // Create new task
      const newTaskId = `task-${Date.now()}`
      const newTask: Task = {
        id: newTaskId,
        title: data.title!,
        description: data.description,
        priority: data.priority as "low" | "medium" | "high",
        status: "todo",
      }

      const newBoard = {
        ...board,
        tasks: {
          ...board.tasks,
          [newTaskId]: newTask,
        },
        columns: {
          ...board.columns,
          [activeColumn]: {
            ...board.columns[activeColumn],
            taskIds: [...board.columns[activeColumn].taskIds, newTaskId],
          },
        },
      }

      setBoards({
        ...boards,
        [activeBoard]: newBoard,
      })
    }

    setDialogOpen(false)
    setActiveColumn(null)
    setEditingTask(null)
  }

  const handleNewBoard = (name: string) => {
    const newBoardId = `board-${Date.now()}`
    const newBoard: Board = {
      id: newBoardId,
      name,
      tasks: {},
      columns: {
        "column-1": { id: "column-1", title: "To Do", taskIds: [] },
        "column-2": { id: "column-2", title: "In Progress", taskIds: [] },
        "column-3": { id: "column-3", title: "Done", taskIds: [] },
      },
      columnOrder: ["column-1", "column-2", "column-3"],
    }

    setBoards({
      ...boards,
      [newBoardId]: newBoard,
    })
    setActiveBoard(newBoardId)
  }

  const handleRenameBoard = (newName: string) => {
    if (!activeBoard) return

    const updatedBoard = { ...boards[activeBoard], name: newName }
    setBoards({
      ...boards,
      [activeBoard]: updatedBoard,
    })
  }

  const handleDeleteBoard = () => {
    if (!activeBoard) return

    const newBoards = { ...boards }
    delete newBoards[activeBoard]
    setBoards(newBoards)
    setActiveBoard(Object.keys(newBoards)[0] || null)
  }

  const handleAccountCreated = (newUsername: string) => {
    setUsername(newUsername)
  }

  if (!username) {
    return <UserAccountCreation onAccountCreated={handleAccountCreated} />
  }

  if (Object.keys(boards).length === 0) {
    return <CreateFirstBoard onBoardCreated={handleNewBoard} />
  }

  const board = activeBoard ? boards[activeBoard] : null

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <Sidebar
        boards={Object.values(boards)}
        activeBoard={activeBoard}
        onBoardSelect={setActiveBoard}
        onNewBoard={handleNewBoard}
        onToggleSidebar={() => setIsMobileSidebarOpen(false)}
        isOpen={sidebarOpen || isMobileSidebarOpen}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between bg-background p-4 shadow-sm">
          <div className="flex items-center">
            <Button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              variant="ghost"
              size="icon"
              className="mr-2 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
            {!sidebarOpen && (
              <Button onClick={() => setSidebarOpen(true)} variant="ghost" size="icon" className="mr-4 hidden md:flex">
                <Menu className="h-6 w-6" />
              </Button>
            )}
            {board && <BoardHeader name={board.name} onRename={handleRenameBoard} onDelete={handleDeleteBoard} />}
          </div>
          <ThemeToggle />
        </div>
        <div className="flex-1 overflow-auto bg-gradient-to-br from-background to-background/80 p-2 sm:p-4 md:p-6 lg:p-8">
          {board && (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex w-full flex-col gap-4 md:flex-row md:items-start md:justify-start overflow-x-auto">
                {board.columnOrder.map((columnId) => {
                  const column = board.columns[columnId]
                  const tasks = column.taskIds.map((taskId) => board.tasks[taskId])

                  return (
                    <Column
                      key={column.id}
                      column={column}
                      tasks={tasks}
                      onAddTask={handleAddTask}
                      onEditTask={handleEditTask}
                      onDeleteTask={handleDeleteTask}
                    />
                  )
                })}
              </div>
            </DragDropContext>
          )}
          <TaskDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSubmit={handleTaskSubmit}
            task={editingTask || undefined}
          />
        </div>
      </div>
    </div>
  )
}

