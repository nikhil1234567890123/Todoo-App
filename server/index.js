import express from "express"
import cors from "cors"
import { supabase } from "./supabase.js"

const app = express()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Server running 🚀")
})

// Get all todos with optional filtering
app.get("/todos", async (req, res) => {
  try {
    const { status, priority, search } = req.query

    let query = supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false })

    // Filter by status
    if (status === "completed") {
      query = query.eq("completed", true)
    } else if (status === "active") {
      query = query.eq("completed", false)
    }

    // Filter by priority
    if (priority) {
      query = query.eq("priority", priority)
    }

    // Search by title
    if (search) {
      query = query.ilike("title", `%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json(data)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todos" })
  }
})

// Create a new todo - returns the created todo
app.post("/todos", async (req, res) => {
  try {
    const { title, priority = "medium", due_date = null, category = null } = req.body

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" })
    }

    const { data, error } = await supabase
      .from("todos")
      .insert({
        title: title.trim(),
        priority,
        due_date,
        category,
        completed: false
      })
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.status(201).json(data)
  } catch (err) {
    res.status(500).json({ error: "Failed to create todo" })
  }
})

// Toggle todo completion
app.patch("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { completed } = req.body

    const { data, error } = await supabase
      .from("todos")
      .update({ completed })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json(data)
  } catch (err) {
    res.status(500).json({ error: "Failed to update todo" })
  }
})

// Full update of a todo (title, priority, due_date, category, completed)
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { title, priority, due_date, category, completed } = req.body

    const updateData = {}
    if (title !== undefined) updateData.title = title.trim()
    if (priority !== undefined) updateData.priority = priority
    if (due_date !== undefined) updateData.due_date = due_date
    if (category !== undefined) updateData.category = category
    if (completed !== undefined) updateData.completed = completed

    const { data, error } = await supabase
      .from("todos")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json(data)
  } catch (err) {
    res.status(500).json({ error: "Failed to update todo" })
  }
})

// Delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: "Failed to delete todo" })
  }
})

// Get todo statistics
app.get("/todos/stats", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("todos")
      .select("completed, priority")

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    const stats = {
      total: data.length,
      completed: data.filter(t => t.completed).length,
      pending: data.filter(t => !t.completed).length,
      highPriority: data.filter(t => t.priority === "high" && !t.completed).length,
    }

    res.json(stats)
  } catch (err) {
    res.status(500).json({ error: "Failed to get stats" })
  }
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
