"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

interface CreateFirstBoardProps {
  onBoardCreated: (boardName: string) => void
}

export function CreateFirstBoard({ onBoardCreated }: CreateFirstBoardProps) {
  const [boardName, setBoardName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (boardName.trim()) {
      onBoardCreated(boardName.trim())
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create Your First Board</CardTitle>
          <CardDescription>Give your board a name to get started.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="boardName">Board Name</Label>
                <Input
                  id="boardName"
                  placeholder="Enter board name"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Create Board
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

