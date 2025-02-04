"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, LogOut } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Task } from "@/components/Dashboard"  // Import Task type
import { supabase } from "@/lib/supabase"  // Assuming you have a supabase client setup
import { useRouter } from 'next/navigation'  // To redirect after logout

interface NavbarProps {
  onAddTask: (task: Task) => void;  // Expect the full Task type here
  userEmail: string;
  userId: string;  // Pass the userId here to link the task to the user
}

const statusOptions = ["To Do", "In Progress", "On Hold", "Completed"]

export function Navbar({ onAddTask, userEmail, userId }: NavbarProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [newTask, setNewTask] = useState({ title: "", date: "", description: "", status: "To Do" })

  const handleAddTask = () => {
    const taskWithUser = { ...newTask, user_id: userId, id: Date.now() } // Add user_id and generate a temporary id (could be updated later when saved to DB)
    onAddTask(taskWithUser) // Send the full Task object
    setNewTask({ title: "", date: "", description: "", status: "To Do" })
    setIsOpen(false)
  }

  // Logout function
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()  // Prevent page refresh on logout button click
    try {
      // Call Supabase signOut method
      await supabase.auth.signOut()
      console.log('User logged out')

      // Optional: Redirect to login page after logout
      router.push("/signin")
    } catch (error) {
      console.error("Error logging out:", error.message)
    }
  }

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-100">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium">{userEmail}</span>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Logout
          <LogOut className="h-4 w-4 ml-2" />
        </Button>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add To Do
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
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
                value={newTask.date}
                onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={newTask.status} onValueChange={(value) => setNewTask({ ...newTask, status: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAddTask}>Add Task</Button>
        </DialogContent>
      </Dialog>
    </nav>
  )
}
