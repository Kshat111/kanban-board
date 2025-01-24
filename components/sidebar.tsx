import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, Layout, ChevronLeft, ChevronRight } from "lucide-react"

interface SidebarProps {
  boards: { id: string; name: string }[]
  activeBoard: string | null
  onBoardSelect: (boardId: string) => void
  onNewBoard: (name: string) => void
  onToggleSidebar: () => void
  isOpen: boolean
}

export function Sidebar({ boards, activeBoard, onBoardSelect, onNewBoard, onToggleSidebar, isOpen }: SidebarProps) {
  const [newBoardName, setNewBoardName] = useState("")

  const handleNewBoard = () => {
    if (newBoardName.trim()) {
      onNewBoard(newBoardName.trim())
      setNewBoardName("")
    }
  }

  return (
    <div
      className={`fixed inset-y-0 left-0 z-20 flex flex-col bg-card transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <h2 className="text-xl font-semibold text-card-foreground">Projects</h2>
        <Button onClick={onToggleSidebar} variant="ghost" size="icon" className="md:hidden">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="mb-4 flex items-center space-x-2">
          <Input
            type="text"
            placeholder="New board name"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleNewBoard()}
          />
          <Button onClick={handleNewBoard} size="icon">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {boards.length === 0 ? (
            <p className="text-center text-muted-foreground">No boards yet. Create your first board!</p>
          ) : (
            boards.map((board) => (
              <Button
                key={board.id}
                variant={board.id === activeBoard ? "secondary" : "ghost"}
                className="mb-2 w-full justify-start"
                onClick={() => onBoardSelect(board.id)}
              >
                <Layout className="mr-2 h-4 w-4" />
                {board.name}
              </Button>
            ))
          )}
        </ScrollArea>
      </div>
    </div>
  )
}

