package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Task struct {
	ID          primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Title       string             `json:"title"`
	Description string             `json:"description"`
	DueDate     string             `json:"dueDate"`
	State       bool               `json:"state"`
}

var collection *mongo.Collection

func main() {
	fmt.Println("Hello World!")

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file!", err)
	}

	MONGODB_URI := os.Getenv("MONGODB_URI")

	clientOptions := options.Client().ApplyURI(MONGODB_URI)
	client, err := mongo.Connect(context.Background(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	defer client.Disconnect(context.Background())

	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to MONGODB ATLAS")

	collection = client.Database("golang_db").Collection("tasks")

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowHeaders: "Origin,Content-Type,Accept",
	}))

	app.Get("/api/tasks", getTasks)
	app.Post("/api/tasks", createTask)
	app.Patch("/api/tasks/:id", updateTask)
	app.Delete("/api/tasks/:id", deleteTask)

	port := os.Getenv("PORT")

	if port == "" {
		port = "5000"
	}

	log.Fatal(app.Listen("0.0.0.0:" + port))

}

func getTasks(c *fiber.Ctx) error {
	var tasks []Task

	cursor, err := collection.Find(context.Background(), bson.M{})

	if err != nil {
		return err
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var task Task
		if err := cursor.Decode(&task); err != nil {
			return err
		}
		tasks = append(tasks, task)
	}

	return c.JSON(tasks)
}

func createTask(c *fiber.Ctx) error {
	task := new(Task)

	if err := c.BodyParser(task); err != nil {
		return err
	}

	if task.Title == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Todo Title cannot be empty"})
	}

	task.DueDate = time.Now().Format("02-01-2006")
	//task.DueDate = time.Now().Format(time.RFC3339)

	insertResult, err := collection.InsertOne(context.Background(), task)
	if err != nil {
		return err
	}

	task.ID = insertResult.InsertedID.(primitive.ObjectID)

	fmt.Printf("Task DueDate: %v\n", task.DueDate)

	return c.Status(201).JSON(task)
}

func updateTask(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid task ID"})
	}

	var task Task
	err = collection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&task)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Task not found"})
	}

	newState := !task.State

	update := bson.M{
		"$set": bson.M{"state": newState},
	}
	_, err = collection.UpdateOne(context.Background(), bson.M{"_id": objectID}, update)
	if err != nil {
		return err
	}

	return c.Status(200).JSON(fiber.Map{"update success": true})
}

func deleteTask(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid task ID"})
	}

	filter := bson.M{"_id": objectID}
	_, err = collection.DeleteOne(context.Background(), filter)

	if err != nil {
		return err
	}

	return c.Status(200).JSON(fiber.Map{"Delete success": true})
}
