package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

type Task struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	State       bool   `json:"state"`
}

func main() {
	fmt.Println("Hello World Winners")
	app := fiber.New()

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file!")
	}

	PORT := os.Getenv("PORT")

	tasks := []Task{}

	app.Get("/api/tasks", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(tasks)
	})

	//Create a new Task
	app.Post("/api/tasks", func(c *fiber.Ctx) error {
		task := &Task{} //{id: 0, title:"", Description:"", State:false}

		if err := c.BodyParser(task); err != nil {
			return err
		}

		if task.Title == "" {
			return c.Status(400).JSON(fiber.Map{"error": "Task title is required"})
		}

		task.ID = len(tasks) + 1
		tasks = append(tasks, *task)

		return c.Status(201).JSON(task)
	})

	//Update a task
	app.Patch("/api/tasks/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")

		for i, task := range tasks {
			if fmt.Sprint(task.ID) == id {
				tasks[i].State = true //!tasks[i].State to alternate b/w States T/F
				return c.Status(200).JSON(tasks[i])
			}
		}

		return c.Status(404).JSON(fiber.Map{"error": "Task not found!"})
	})

	//Delete a task
	app.Delete("/api/tasks/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")

		for i, task := range tasks {
			if fmt.Sprint(task.ID) == id {
				tasks = append(tasks[:i], tasks[i+1:]...)
				return c.Status(200).JSON(fiber.Map{"success": true})
			}
		}

		return c.Status(404).JSON(fiber.Map{"error": "Task not found!"})
	})

	log.Fatal(app.Listen(":" + PORT))
}
