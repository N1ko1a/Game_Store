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
	"github.com/N1ko1a/rawgAPI/moduls"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"net/http"
	"strconv"
)

var mongoClient *mongo.Client //kreiramo instancu da bi se povezali sa bazom i imali interakcije
const uri = "mongodb://localhost:27017"

// Dodavanje podataka u bazu
func InsertIntoMongoDB(game moduls.Game) error {
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
		{Key: "description", Value: game.Description}, // Add this line for the description field
	})

	return err

}

// preuzimanj
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

func InsertIntoMongoDBGenres(genresTable moduls.GenresTable) error {
	ctx := context.TODO()
	quickstartDatabase := mongoClient.Database("GameStore")       //Ovo je baza
	podcastsCollection := quickstartDatabase.Collection("Genres") //Ovo je colekcija

	// Check if the collection is empty
	count, err := podcastsCollection.CountDocuments(ctx, bson.D{})
	if err != nil {
		return fmt.Errorf("error checking if collection is empty: %s", err.Error())
	}

	if count >= 18 {
		// Collection is not empty, skip insertion
		fmt.Println("Skipping insertion as the collection is not empty.")
		return nil
	}

	// Collection is empty, proceed with insertion
	_, err = podcastsCollection.InsertOne(ctx, bson.D{
		{Key: "id", Value: genresTable.Id},
		{Key: "name", Value: genresTable.Name},
	})
	return err

}
func InsertIntoMongoDBPlatforms(platformsTable moduls.PlatformsTable) error {
	ctx := context.TODO()
	quickstartDatabase := mongoClient.Database("GameStore")          //Ovo je baza
	podcastsCollection := quickstartDatabase.Collection("Platforms") //Ovo je colekcija

	// Check if the collection is empty
	count, err := podcastsCollection.CountDocuments(ctx, bson.D{})
	if err != nil {
		return fmt.Errorf("error checking if collection is empty: %s", err.Error())
	}

	if count >= 20 {
		// Collection is not empty, skip insertion
		fmt.Println("Skipping insertion as the collection is not empty.")
		return nil
	}

	// Collection is empty, proceed with insertion
	_, err = podcastsCollection.InsertOne(ctx, bson.D{
		{Key: "id", Value: platformsTable.Id},
		{Key: "name", Value: platformsTable.Name},
	})
	return err

}
func InsertIntoMongoDBStores(storesTable moduls.StoresTable) error {
	ctx := context.TODO()
	quickstartDatabase := mongoClient.Database("GameStore")       //Ovo je baza
	podcastsCollection := quickstartDatabase.Collection("Stores") //Ovo je colekcija

	// Check if the collection is empty
	count, err := podcastsCollection.CountDocuments(ctx, bson.D{})
	if err != nil {
		return fmt.Errorf("error checking if collection is empty: %s", err.Error())
	}

	if count >= 10 {
		// Collection is not empty, skip insertion
		fmt.Println("Skipping insertion as the collection is not empty.")
		return nil
	}

	// Collection is empty, proceed with insertion
	_, err = podcastsCollection.InsertOne(ctx, bson.D{
		{Key: "id", Value: storesTable.Id},
		{Key: "name", Value: storesTable.Name},
	})
	return err

}

func InsertIntoMongoDBUsers(user moduls.User) error {
	ctx := context.TODO()
	quickstartDatabase := mongoClient.Database("GameStore")      //Ovo je baza
	podcastsCollection := quickstartDatabase.Collection("Users") //Ovo je colekcija

	//Proverava da li postoji vec user sa istim email-om
	filter := bson.D{{Key: "email", Value: user.Email}}
	existingDoc := podcastsCollection.FindOne(ctx, filter)

	if existingDoc.Err() == nil {
		// Document with the same email already exists, skip insertion
		fmt.Printf("Skipping insertion for user - Name: %s -Email: %s as it already exists.\n", user.FirstName, user.Email)
		return nil
	} else if existingDoc.Err() != mongo.ErrNoDocuments {
		// An error occurred while checking for existing documents
		return existingDoc.Err()
	}
	// Collection is empty, proceed with insertion
	insertResult, err := podcastsCollection.InsertOne(ctx, bson.D{
		{Key: "firstName", Value: user.FirstName},
		{Key: "lastName", Value: user.LastName},
		{Key: "email", Value: user.Email},
		{Key: "password", Value: user.Password},
	})
	if err != nil {
		return err
	}

	fmt.Printf("Inserted document with ID: %v\n", insertResult.InsertedID)
	return nil

}
func GetGenresDirect() error {
	baseURL := fmt.Sprintf("https://api.rawg.io/api/genres?key=f33a7a5ed23e4dc79693a42c08b2c83a")

	// Pravimo novi http klijent da komuniciramo sa API
	client := &http.Client{}

	var genresTableResponse *moduls.GenresTableResponse

	err := GetJson(client, baseURL, &genresTableResponse)
	if err != nil {
		return fmt.Errorf("error getting genres: %s", err.Error())
	}

	// Print the genres and update the counter
	for _, genre := range genresTableResponse.Results {
		fmt.Printf("Genre %d - Name: %s, Id: %d\n", genre.Id, genre.Name, genre.Id)

		err := InsertIntoMongoDBGenres(genre)
		if err != nil {
			return fmt.Errorf("error inserting data into MongoDB: %s", err.Error())
		}
	}

	fmt.Println("All Genres inserted into MongoDB")
	return nil
}

func GetPlatformsDirect() error {
	baseURL := fmt.Sprintf("https://api.rawg.io/api/platforms?key=f33a7a5ed23e4dc79693a42c08b2c83a")

	// Pravimo novi http klijent da komuniciramo sa API
	client := &http.Client{}

	var platformsTableResponse *moduls.PlatformsTableResponse

	err := GetJson(client, baseURL, &platformsTableResponse)
	if err != nil {
		return fmt.Errorf("error getting genres: %s", err.Error())
	}

	// Print the genres and update the counter
	for _, platform := range platformsTableResponse.Results {
		fmt.Printf("Genre %d - Name: %s, Id: %d\n", platform.Id, platform.Name, platform.Id)

		err := InsertIntoMongoDBPlatforms(platform)
		if err != nil {
			return fmt.Errorf("error inserting data into MongoDB: %s", err.Error())
		}
	}

	fmt.Println("All Platforms inserted into MongoDB")
	return nil
}

func GetStoresDirect() error {
	baseURL := fmt.Sprintf("https://api.rawg.io/api/stores?key=f33a7a5ed23e4dc79693a42c08b2c83a")

	// Pravimo novi http klijent da komuniciramo sa API
	client := &http.Client{}

	var storesTableResponse *moduls.StoresTableResponse

	err := GetJson(client, baseURL, &storesTableResponse)
	if err != nil {
		return fmt.Errorf("error getting stores: %s", err.Error())
	}

	// Print the genres and update the counter
	for _, stores := range storesTableResponse.Results {
		fmt.Printf("Stores %d - Name: %s, Id: %d\n", stores.Id, stores.Name, stores.Id)

		err := InsertIntoMongoDBStores(stores)
		if err != nil {
			return fmt.Errorf("error inserting data into MongoDB: %s", err.Error())
		}
	}

	fmt.Println("All Stores inserted into MongoDB")
	return nil
}
func GetGameDescription(client *http.Client, gameID int) (string, error) {
	baseURL := fmt.Sprintf("https://api.rawg.io/api/games/%d?key=f33a7a5ed23e4dc79693a42c08b2c83a", gameID)

	resp, err := client.Get(baseURL)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("non-OK HTTP status: %s", resp.Status)
	}

	var gameDetails map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&gameDetails); err != nil {
		return "", err
	}

	// Extract description from the API response
	description, ok := gameDetails["description"].(string)
	if !ok {
		return "", fmt.Errorf("description not found in API response")
	}

	return description, nil
}

// preuzimanje igrica
func GetGamesDirect() error {
	totalGames := 0
	totalPages := 500
	itemsPerPage := 20
	baseURL := fmt.Sprintf("https://api.rawg.io/api/games?key=f33a7a5ed23e4dc79693a42c08b2c83a&dates=2019-09-01,2023-10-18&page=%d&page_size=%d&ordering=-popularity", totalPages, itemsPerPage)

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
		var gamesResponse *moduls.GamesResponse
		err := GetJson(client, url, &gamesResponse)
		if err != nil {
			return fmt.Errorf("error getting games: %s", err.Error())
		}

		// Print the games and update the counter
		for _, game := range gamesResponse.Results {
			counter++
			totalGames++

			// Fetch the description using the new function
			description, err := GetGameDescription(client, game.Id)
			if err != nil {
				fmt.Printf("Error fetching description for game ID %d: %s\n", game.Id, err.Error())
			} else {
				game.Description = description
			}
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
			if err = InsertIntoMongoDB(game); err != nil {
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

func GetGenres(c *gin.Context) {

	ctx := context.TODO()
	quickstartDatabase := mongoClient.Database("GameStore")
	gamesCollection := quickstartDatabase.Collection("Genres")

	cursor, err := gamesCollection.Find(ctx, bson.M{})
	if err != nil {
		log.Fatal(err)
	}
	var genres []bson.M
	if err = cursor.All(ctx, &genres); err != nil {
		log.Fatal(err)
	}
	c.JSON(http.StatusOK, gin.H{"genres": genres})
}

// Preuzmi platforme
func GetPlatforms(c *gin.Context) {

	ctx := context.TODO()
	quickstartDatabase := mongoClient.Database("GameStore")
	gamesCollection := quickstartDatabase.Collection("Platforms")

	cursor, err := gamesCollection.Find(ctx, bson.M{})
	if err != nil {
		log.Fatal(err)
	}
	var platforms []bson.M
	if err = cursor.All(ctx, &platforms); err != nil {
		log.Fatal(err)
	}
	c.JSON(http.StatusOK, gin.H{"platforms": platforms})
}

// Preuzmi platforme
func GetStores(c *gin.Context) {

	ctx := context.TODO()
	quickstartDatabase := mongoClient.Database("GameStore")
	gamesCollection := quickstartDatabase.Collection("Stores")

	cursor, err := gamesCollection.Find(ctx, bson.M{})
	if err != nil {
		log.Fatal(err)
	}
	var stores []bson.M
	if err = cursor.All(ctx, &stores); err != nil {
		log.Fatal(err)
	}
	c.JSON(http.StatusOK, gin.H{"stores": stores})
}

// GetGame retrieves a specific game by its ID
func GetGame(c *gin.Context) {
	// Get the game ID from the URL parameter
	gameID := c.Param("id")

	// Convert the gameID to an integer
	id, err := strconv.Atoi(gameID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid game ID"})
		return
	}

	// Connect to the MongoDB database
	ctx := context.TODO()
	quickstartDatabase := mongoClient.Database("GameStore")
	gamesCollection := quickstartDatabase.Collection("Games")

	// Query the game by ID
	var game moduls.Game
	err = gamesCollection.FindOne(ctx, bson.M{"id": id}).Decode(&game)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Game not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error querying the database"})
		}
		return
	}

	// Return the game as JSON
	c.JSON(http.StatusOK, gin.H{"game": game})
}
func Login(c *gin.Context) {
	var user moduls.User
	user.FirstName = c.Param("firstName")
	user.LastName = c.Param("lastName")
	user.Email = c.Param("email")
	user.Password = c.Param("password")
	InsertIntoMongoDBUsers(user)
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
	// Call GetGenres function to insert data into MongoDB
	if err := GetGenresDirect(); err != nil {
		fmt.Printf("error running GetGenres: %s\n", err.Error())
		return
	}

	// Call GetPlatforms function to insert data into MongoDB
	if err := GetPlatformsDirect(); err != nil {
		fmt.Printf("error running GetPlatforms: %s\n", err.Error())
		return
	}
	// Call GetStores function to insert data into MongoDB
	if err := GetStoresDirect(); err != nil {
		fmt.Printf("error running GetStores: %s\n", err.Error())
		return
	}

	// Replace the existing GetAllGames route with the new GetPaginatedGames route
	router.GET("/games", GetPaginatedGames)
	router.GET("/genres", GetGenres)
	router.GET("/platforms", GetPlatforms)
	router.GET("/stores", GetStores)
	router.GET("/games/:id", GetGame)
	router.POST("/users/:firstName/:lastName/:email/:password", Login)
	router.Run(":8080")
}
