package main

import (
	"context"
	"encoding/json" // Add this import statement
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"strings"
	// "go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"net/http"
	"strconv"
)

// Struktura podataka
type Game struct {
	Id              int               `json:"id"`
	Name            string            `json:"name"`
	BackgroundImage string            `json:"background_image"`
	Rating          float64           `json:"rating"`
	Released        string            `json:"released"`
	AgeRating       *EsrbRating       `json:"esrb_rating"` //Pointer na struct
	GamePlatforms   []PlatformWrapper `json:"platforms"`   //niz structa
	Stores          []StoreWrapper    `json:"stores"`
	Genres          []Genre           `json:"genres"`
}
type Genre struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}
type StoreWrapper struct {
	Store Store `json:"store"`
}
type Store struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
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

	if count >= 10000 {
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
		{Key: "stores", Value: game.Stores},
		{Key: "genres", Value: game.Genres},
		{Key: "released", Value: game.Released},
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

	// Create a new HTTP client for making API requests
	client := &http.Client{}

	// Check if the collection has less than 10,000 games
	if isCollectionUnderLimit, err := isCollectionUnderLimit(10000); err != nil {
		return err
	} else if !isCollectionUnderLimit {
		// Collection already has 10,000 or more games, skip fetching and printing games
		fmt.Println("Skipping fetching games as the collection already has 10,000 or more games.")
		return nil
	}

	// Initialize a counter
	counter := 0

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

	fmt.Println("All Games inserted into MongoDB")
	return nil
}

// Check if the collection has less than the specified limit of games
func isCollectionUnderLimit(limit int64) (bool, error) {
	ctx := context.TODO()
	quickstartDatabase := mongoClient.Database("GameStore")
	gamesCollection := quickstartDatabase.Collection("Games")

	count, err := gamesCollection.CountDocuments(ctx, bson.D{})
	if err != nil {
		return false, fmt.Errorf("error checking if collection is under limit: %s", err.Error())
	}

	return count < limit, nil
}

// GetPaginatedGames retrieves paginated games based on page, pageSize, and optional search query parameters.
func GetPaginatedGames(c *gin.Context) {
	ctx := context.TODO()
	quickstartDatabase := mongoClient.Database("GameStore")
	gamesCollection := quickstartDatabase.Collection("Games")

	// Parse query parameters for pagination and search
	page, err := strconv.Atoi(c.Query("page"))
	if err != nil || page < 1 {
		page = 1
	}

	pageSize, err := strconv.Atoi(c.Query("pageSize"))
	if err != nil || pageSize < 1 {
		pageSize = 10 // Default page size
	}

	searchQuery := c.Query("search")
	platformQuery := c.Query("platform")
	storeQuery := c.Query("store")
	genreQuery := c.Query("genre")
	ratingQuery := c.Query("rating")
	ageQuery := c.Query("age")
	fmt.Println("Age: ", ageQuery)
	// Build the filter based on pagination and search criteria
	filter := bson.M{}
	if searchQuery != "" {
		filter["name"] = bson.M{"$regex": searchQuery, "$options": "i"}
	}
	if platformQuery != "" {
		platformID, err := strconv.Atoi(platformQuery)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error querying platform filter"})
		}
		filter["platforms.platform.id"] = platformID
	}
	if storeQuery != "" {
		storeID, err := strconv.Atoi(storeQuery)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error querying store filter"})
		}
		filter["stores.store.id"] = storeID
	}
	if genreQuery != "" {
		genreID, err := strconv.Atoi(genreQuery)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error querying genre filter"})
		}
		filter["genres.id"] = genreID
	}
	if ratingQuery != "" {
		ratingID, err := strconv.Atoi(ratingQuery)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error querying rating filter"})
		}

		// Set up a rating range in the filter
		filter["rating"] = bson.M{"$gte": ratingID, "$lt": ratingID + 1}
	}
	if ageQuery != "" {
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error querying AgeRating filter"})
		}
		filter["esrb_rating.name"] = bson.M{"$regex": ageQuery}
	}
	// Create a sorting option based on the query parameters
	sortOptions := bson.D{}

	sortQuery := c.Query("sort")
	signQuery := c.Query("sign")
	fmt.Println("Znak: ", signQuery)
	// Sort by name if requested
	if sortQuery != "" {
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error sorting name filter"})
		}
		if signQuery == "1" {
			sortOptions = append(sortOptions, bson.E{Key: strings.ToLower(sortQuery), Value: 1})
		} else {
			sortOptions = append(sortOptions, bson.E{Key: strings.ToLower(sortQuery), Value: -1})
		}
	}

	// // Sort by rating if requested
	// if c.Query("sortByRating") == "asc" {
	//     sortOptions = append(sortOptions, bson.E{Key: "rating", Value: 1})
	// } else if c.Query("sortByRating") == "desc" {
	//     sortOptions = append(sortOptions, bson.E{Key: "rating", Value: -1})
	// }
	// Calculate offset and limit for the database query
	offset := (page - 1) * pageSize
	limit := pageSize

	// Query games from the collection with pagination and search filter
	cursor, err := gamesCollection.Find(ctx, filter, options.Find().SetSkip(int64(offset)).SetLimit(int64(limit)).SetSort(sortOptions))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error querying paginated games from the database"})
		return
	}
	defer cursor.Close(ctx)

	// Iterate through the cursor and store games in a slice
	var games []bson.M
	if err = cursor.All(ctx, &games); err != nil {
		log.Fatal(err)
	}

	// Check for any errors during cursor iteration
	if err := cursor.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error iterating over paginated games"})
		return
	}
	// Query for the total count of all items (without pagination and filters)
	totalCount, err := gamesCollection.CountDocuments(ctx, bson.D{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error getting total count of items"})
		return
	}

	// Query for the count of filtered items
	filteredCount, err := gamesCollection.CountDocuments(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error getting filtered count of items"})
		return
	}

	// Determine which count to use based on whether filters are applied
	var countToReturn int64
	if searchQuery != "" || platformQuery != "" || storeQuery != "" || genreQuery != "" || ratingQuery != "" || ageQuery != "" {
		// Filters are applied, return filteredCount
		countToReturn = filteredCount
	} else {
		// No filters applied, return totalCount
		countToReturn = totalCount
	}

	c.JSON(http.StatusOK, gin.H{
		"games":         games,
		"countToReturn": countToReturn,
	})
}
func main() {
	router := gin.Default()
	// Configure CORS middlewar
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173"} // Add your frontend's origin
	router.Use(cors.New(config))
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
	// Replace the existing GetAllGames route with the new GetPaginatedGames route
	router.GET("/games", GetPaginatedGames)
	router.Run(":8080")
}
