import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash, Check, X } from "lucide-react"

interface BoardHeaderProps {
  name: string
  onRename: (newName: string) => void
  onDelete: () => void
}

export function BoardHeader({ name, onRename, onDelete }: BoardHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState(name)

  const handleRename = () => {
    if (newName.trim() && newName !== name) {
      onRename(newName.trim())
    }
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="mb-4 sm:mb-6 md:mb-8 flex items-center space-x-2">
        <Input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="text-2xl font-bold"
          onKeyPress={(e) => e.key === "Enter" && handleRename()}
        />
        <Button onClick={handleRename} size="icon" variant="ghost">
          <Check className="h-4 w-4" />
        </Button>
        <Button onClick={() => setIsEditing(false)} size="icon" variant="ghost">
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="mb-4 sm:mb-6 md:mb-8 flex items-center space-x-2">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">{name}</h1>
      <Button onClick={() => setIsEditing(true)} size="icon" variant="ghost">
        <Pencil className="h-4 w-4" />
      </Button>
      <Button onClick={onDelete} size="icon" variant="ghost" className="text-destructive hover:text-destructive">
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  )
}

