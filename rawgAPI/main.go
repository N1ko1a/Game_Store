package main

import (
	"context"
	"encoding/json" // Add this import statement
	"fmt"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"net/http"
)

// Struktura podataka
type Game struct {
	Id              int               `json:"id"`
	Name            string            `json:"name"`
	BackgroundImage string            `json"background_image"`
	Rating          float64           `json:"rating"`
	AgeRating       *EsrbRating       `json:"esrb_rating"` //Pointer na struct
	GamePlatforms   []PlatformWrapper `json:"platforms"`   //niz structa
}

type EsrbRating struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type PlatformWrapper struct {
	Platform Platform `json:"platform"` // ovo je objekat koji sadrzi objekat u sebi sa ID i Name
}

type Platform struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type GamesResponse struct {
	Results []Game `json:"results"` //bice niz igrica
}

// Podaci za server
var mongoClient *mongo.Client //kreiramo instancu da bi se povezali sa bazom i imali interakcije
const uri = "mongodb://localhost:27017"

// Dodavanje podataka u bazu
func InsertIntoMongoDB(game Game) error {
	ctx := context.TODO()
	quickstartDatabase := mongoClient.Database("GameStore")      //Ovo je baza
	podcastsCollection := quickstartDatabase.Collection("Games") //Ovo je colekcija

	// //Proverava da li postoji vec igirca sa id u nasoj bazi
	// filter := bson.D{{Key: "id", Value: game.Id}}
	// existingDoc := podcastsCollection.FindOne(ctx, filter)
	//
	// if existingDoc.Err() == nil {
	// 	// Document with the same ID already exists, skip insertion
	// 	fmt.Printf("Skipping insertion for game %d - Name: %s (ID: %d) as it already exists.\n", game.Id, game.Name, game.Id)
	// 	return nil
	// } else if existingDoc.Err() != mongo.ErrNoDocuments {
	// 	// An error occurred while checking for existing documents
	// 	return existingDoc.Err()
	// }

	// Check if the collection is empty
	count, err := podcastsCollection.CountDocuments(ctx, bson.D{})
	if err != nil {
		return fmt.Errorf("error checking if collection is empty: %s", err.Error())
	}

	if count > 0 {
		// Collection is not empty, skip insertion
		fmt.Println("Skipping insertion as the collection is not empty.")
		return nil
	}

	// Collection is empty, proceed with insertion
	_, err = podcastsCollection.InsertOne(ctx, bson.D{
		{Key: "id", Value: game.Id},
		{Key: "name", Value: game.Name},
		{Key: "background_image", Value: game.BackgroundImage},
		{Key: "rating", Value: game.Rating},
		{Key: "esrb_rating", Value: game.AgeRating},
		{Key: "platforms", Value: game.GamePlatforms},
	})
	return err

}

// preuzimanje JSON podataka sa udaljenog servera putem HTTP GET zahteva,a zatim dekodiranje tih podataka u strukturu ili vrednost koja je prosleđena kao target argument.
func GetJson(client *http.Client, url string, target interface{}) error {
	resp, err := client.Get(url) // slanje zahteva
	if err != nil {
		return err
	}

	defer resp.Body.Close() //zatvaramo body kako bi sprecili curenje resursa

	//provera statusa odgovora
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("non-OK HTTP status: %s", resp.Status)
	}

	return json.NewDecoder(resp.Body).Decode(target) //pretvara JSON u struct
}

// preuzimanje igrica
func GetGamesDirect() error {
	totalGames := 0
	totalPages := 500
	itemsPerPage := 20
	baseURL := fmt.Sprintf("https://api.rawg.io/api/games?key=4557ebdc3256470e8e4b78f25d277a04&dates=2019-09-01,2023-10-18&page=%d&page_size=%d&ordering=-popularity", totalPages, itemsPerPage)

	// Initialize a counter
	counter := 0

	// Create a new HTTP client for making API requests
	client := &http.Client{}

	for page := 1; page <= totalPages; page++ {
		url := fmt.Sprintf("%s&page=%d", baseURL, page)

		var gamesResponse *GamesResponse

		err := GetJson(client, url, &gamesResponse)
		if err != nil {
			return fmt.Errorf("error getting games: %s", err.Error())
		}

		// Print the games and update the counter
		for _, game := range gamesResponse.Results {
			counter++
			totalGames++

			// Check if the game is already in the database
			exists, err := gameExistsInDatabase(game.Id)
			if err != nil {
				return fmt.Errorf("error checking if game exists in database: %s", err.Error())
			}

			if !exists {
				fmt.Printf("Game %d - Name: %s, Id: %d, Background_image: %s, Rating: %f\n", counter, game.Name, game.Id, game.BackgroundImage, game.Rating)

				// Check if AgeRating is null or not
				if game.AgeRating != nil {
					fmt.Printf("Age Rating: ID %d, Name: %s\n", game.AgeRating.Id, game.AgeRating.Name)
				} else {
					fmt.Println("Age Rating is null")
				}

				// Iterate through the slice of platform wrappers and print each platform's information
				for _, platformWrapper := range game.GamePlatforms {
					platform := platformWrapper.Platform
					fmt.Printf("Platform: ID %d, Name: %s\n", platform.Id, platform.Name)
				}

				// Insert data into MongoDB
				err := InsertIntoMongoDB(game)
				if err != nil {
					return fmt.Errorf("error inserting data into MongoDB: %s", err.Error())
				}

				// Print the game inserted message
				fmt.Printf("Game inserted into MongoDB - Total Games: %d\n", totalGames)
			}
		}
	}

	fmt.Println("All Games inserted into MongoDB")
	return nil
}

// Check if the game with the specified ID already exists in the database
func gameExistsInDatabase(gameID int) (bool, error) {
	ctx := context.TODO()
	quickstartDatabase := mongoClient.Database("GameStore")
	gamesCollection := quickstartDatabase.Collection("Games")

	filter := bson.D{{Key: "id", Value: gameID}}
	existingDoc := gamesCollection.FindOne(ctx, filter)

	if existingDoc.Err() == nil {
		// Document with the same ID already exists
		return true, nil
	} else if existingDoc.Err() == mongo.ErrNoDocuments {
		// Document with the same ID does not exist
		return false, nil
	} else {
		// An error occurred while checking for existing documents
		return false, existingDoc.Err()
	}
}

// Get all games
func GetAllGames(c *gin.Context) {
	ctx := context.TODO()
	quickstartDatabase := mongoClient.Database("GameStore")
	gamesCollection := quickstartDatabase.Collection("Games")

	// Query all games from the collection
	cursor, err := gamesCollection.Find(ctx, bson.D{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error querying games from the database"})
		return
	}
	defer cursor.Close(ctx)

	// Iterate through the cursor and store games in a slice
	var games []Game
	for cursor.Next(ctx) {
		var game Game
		if err := cursor.Decode(&game); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding game data"})
			return
		}
		games = append(games, game)
	}

	// Check for any errors during cursor iteration
	if err := cursor.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error iterating over games"})
		return
	}

	// Return the list of games as JSON response
	c.JSON(http.StatusOK, gin.H{"games": games})
}
func main() {
	router := gin.Default()

	// Povezivanje sa bazom podataka
	ctx := context.TODO()
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(uri).SetServerAPIOptions(serverAPI)

	var err error
	mongoClient, err = mongo.Connect(context.TODO(), opts)
	if err != nil {
		fmt.Printf("error connecting to MongoDB: %s\n", err.Error())
		return
	}
	defer func() {
		if err := mongoClient.Disconnect(ctx); err != nil {
			fmt.Printf("error disconnecting from MongoDB: %s\n", err.Error())
		}
	}()

	// Call GetGames function to insert data into MongoDB
	if err := GetGamesDirect(); err != nil {
		fmt.Printf("error running GetGames: %s\n", err.Error())
		return
	}
	router.GET("/games", GetAllGames)
	router.Run(":8080")
}
