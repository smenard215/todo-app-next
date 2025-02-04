"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { TaskCard } from "@/components/TaskCard"
import { supabase } from "@/lib/supabase"

const columns = [
  { title: "To Do", color: "bg-red-100" },
  { title: "In Progress", color: "bg-yellow-100" },
  { title: "On Hold", color: "bg-blue-100" },
  { title: "Completed", color: "bg-green-100" },
]

export type Task = {
  id: number
  title: string
  description: string
  status: string
  date: string
  user_id: string
}

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true) // Keep track of loading state
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setUser(session.user)
          await fetchTasks(session.user.id)
          setLoading(false) // Set loading to false once data is fetched
        } else {
          setLoading(false) // Ensure loading is set to false even if no session
          router.push("/signin") // If no session, redirect to signin
        }
      } catch (error) {
        console.error("Error fetching session:", error)
        setLoading(false) // Set loading to false even if an error occurs
      }
    }

    fetchUser()
  }, [router])

  const fetchTasks = async (userId: string) => {
    const { data, error } = await supabase.from("tasks").select("*").eq("user_id", userId)
    if (error) {
      console.error("Error fetching tasks:", error)
    } else {
      setTasks(data)
    }
  }

  const handleAddTask = async (task: Task) => {
    // Add the task to Supabase
    const { data, error } = await supabase.from("tasks").insert([
      {
        title: task.title,
        description: task.description,
        status: task.status,
        date: task.date,
        user_id: task.user_id,
      },
    ])

    if (error) {
      console.error("Error adding task:", error)
    } else {
      // After adding, fetch the updated tasks
      fetchTasks(task.user_id)
    }
  }

  const handleUpdateTask = async (id: number, updatedTask: { title: string; date: string; description: string; status: string }) => {
    const { error } = await supabase
      .from("tasks")
      .update(updatedTask)
      .eq("id", id)

    if (error) {
      console.error("Error updating task:", error)
    } else {
      // Fetch updated tasks
      fetchTasks(user.id)
    }
  }

  const handleDeleteTask = async (id: number) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting task:", error)
    } else {
      // Fetch updated tasks
      fetchTasks(user.id)
    }
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", id)

    if (error) {
      console.error("Error updating status:", error)
    } else {
      // Fetch updated tasks
      fetchTasks(user.id)
    }
  }

  if (loading) {
    return <div>Loading...</div> // Still loading, show loading state
  }

  if (!user) {
    return <div>No user logged in. Redirecting...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        onLogout={() => router.push("/signin")}
        userEmail={user.email}
        onAddTask={handleAddTask}
        userId={user.id}
      />
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {columns.map((column) => (
          <Card key={column.title} className={column.color}>
            <CardHeader>
              <CardTitle>{column.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {tasks
                .filter((task) => task.status === column.title)
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    date={task.date}
                    description={task.description}
                    status={task.status}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
