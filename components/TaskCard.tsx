"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Trash2, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Update id type to number
interface TaskCardProps {
  id: number  // Changed from string to number
  title: string
  date: string
  description: string
  status: string
  onUpdate: (id: number, updatedTask: { title: string; date: string; description: string; status: string }) => void  // Updated to accept number
  onDelete: (id: number) => void  // Updated to accept number
  onStatusChange: (id: number, newStatus: string) => void  // Updated to accept number
}

const statusOptions = ["To Do", "In Progress", "On Hold", "Completed"]

export function TaskCard({ id, title, date, description, status, onUpdate, onDelete, onStatusChange }: TaskCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editedTask, setEditedTask] = useState({ title, date, description, status })

  const handleUpdate = () => {
    // Destructure editedTask and pass only the relevant properties to onUpdate
    const { title, date, description, status } = editedTask
    onUpdate(id, { title, date, description, status })  // Pass only the necessary properties
    setIsOpen(false)
  }

  const handleDelete = () => {
    onDelete(id)  // id is now a number
  }

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(id, newStatus)  // id is now a number
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="flex space-x-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit task</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={editedTask.title}
                    onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={editedTask.date}
                    onChange={(e) => setEditedTask({ ...editedTask, date: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={editedTask.description}
                    onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={handleUpdate}>Save changes</Button>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete task</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-2">
          {new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
        <p className="text-sm mb-2">{description}</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {status} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {statusOptions.map((option) => (
              <DropdownMenuItem key={option} onSelect={() => handleStatusChange(option)}>
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  )
}
