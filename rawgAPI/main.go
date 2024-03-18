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
	"github.com/asaskevich/govalidator"
	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"time"
)

// TREBA GA PREBACITI U .ENV
var secretKey = []byte("SecretYouShouldHide")

var mongoClient *mongo.Client //kreiramo instancu da bi se povezali sa bazom i imali interakcije
const uri = "mongodb://localhost:27017"

// Funkcija za dodavanje igrica u bazu dodaje samo ako ima manje od 10000 igara
func InsertIntoMongoDB(game moduls.Game) error {
	ctx := context.TODO()                                        //vraca prazan context koji sluzi kao placeholder
	quickstartDatabase := mongoClient.Database("GameStore")      //Ovo je baza, koristimo instancu inzad koju smo kreirali
	podcastsCollection := quickstartDatabase.Collection("Games") //Ovo je colekcija, koristimo umesto instance ime baze

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
	count, err := podcastsCollection.CountDocuments(ctx, bson.D{}) //brojimo koliko ima podataka u bazi
	//ctx se koristi kako bi se omogucilo pracenje i upravljanje saznanjima o pozadinskim zadacima, kao sto su prekidi ili otkazivanja
	//bson je binarni json (slican format koji mongodb koristi za svoje dokumente), koristimo prazan dokument jer zelimo da brojimo koliko ima elemenata bez ikakvog filtera
	if err != nil {
		//ako je greska == nil sve je uredu ako nije onda je doslo do greske
		return fmt.Errorf("error checking if collection is empty: %s", err.Error())
	}

	if count >= 10000 {
		// Ako ima 10000 ili vise igrica nema potrebe da dodajemo vise pa preskacemo
		fmt.Println("Skipping insertion as the collection is not empty.")
		return nil
	}

	// Collection is empty, proceed with insertion
	//_ sa ovim ignorisemo rezultat umetanja igrice, jer necemo da printamo podatke igrice koju unosimo
	// err ostavljamo jer u slucaju da dodje do greske vraticemo tu gresku da vidmo sta se desava
	//key je ime polja koji se nalazi u bazi, value je podatak koji hocemo da ubacimo
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

// Preuzima JSON podatke iz zadatog url-a i dekodira ih u zadatu strukturu
func GetJson(client *http.Client, url string, target interface{}) error {
	resp, err := client.Get(url) // salje HTTP GET zahtev na specifiran url koristeci client koji smo zadali ako je sve kako treba vraca resp ako nije vraca err
	if err != nil {
		return err
	}

	defer resp.Body.Close() // nakon sto je zahtev uspesno poslat zatvara se telo dogovora resp.body kako bih se sprecilo curenje memorije

	//provera statusa odgovora
	if resp.StatusCode != http.StatusOK {
		//ako dodje do greske
		return fmt.Errorf("non-OK HTTP status: %s", resp.Status)
	}
	//dekodiramo json format u go structuru koju smo zadali za target (target je interface tipa sto znaci mozemo da primiti bilo koju vrstu podataka)
	//direktno dekodiramo iz resp.Body koristeci jsonDecoder a rezultat stavljamo u target
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
		// Ako ima 18 ili vise dokumenata nema potrebe da dodajemo nove svi su tu
		fmt.Println("Skipping insertion as the collection is not empty.")
		return nil
	}

	// Nema dovoljno dokumenata pa mozemo da dodamo jos
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
		// Ako ima 20 ili vise preskacemo
		fmt.Println("Skipping insertion as the collection is not empty.")
		return nil
	}

	// U suprotnom mozemo da dodamo
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
		// Ako ima 10 ili vise preskacemo
		fmt.Println("Skipping insertion as the collection is not empty.")
		return nil
	}

	// U suprotnom dodajemo
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
	//Kreira se filter koji specifira da trazimo email vrednosti user.Email
	filter := bson.D{{Key: "email", Value: user.Email}}
	existingDoc := podcastsCollection.FindOne(ctx, filter) //koristimo findOne i kao argument dodajemo filter iznad sto smo kreirali
	// U slucaju da ne postoji email vraca nil a ako postoji vraca vrednost tog email

	//mogli smo ovo Err da izbacimo
	if existingDoc.Err() == nil {
		// Document with the same email already exists, skip insertion
		fmt.Printf("Skipping insertion for user - Name: %s -Email: %s as it already exists.\n", user.FirstName, user.Email)
		return nil
		// Ako izbacimo Err bilo bi else{}
	} else if existingDoc.Err() != mongo.ErrNoDocuments {
		// An error occurred while checking for existing documents
		return existingDoc.Err()
	}
	// ako nas ne izbaci iz funkcije return nil to znaci da taj user ne postoji i mozemo da ga dodamo
	// sada nismo stavili _  jer hocemo da printamo user-a pa smo postavili insertResult
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

// preuzimamo genres iz rawgApi i ubacujemo ih u bazu
func GetGenresDirect() error {
	baseURL := fmt.Sprintf("https://api.rawg.io/api/genres?key=f33a7a5ed23e4dc79693a42c08b2c83a")

	// Pravimo novi http klijent da komuniciramo sa API
	// client je pokazivac na http.Client i kasnije u GetJson funkciji mozemo da primenimo potrebne funkcije kao kada bih primenili na samom http.Client
	client := &http.Client{}

	//Uzimamo direktno vrednosti iz moduls.GenresTableResponse i ne pravimo kopiju
	var genresTableResponse *moduls.GenresTableResponse

	//prosledjujemo adresu genresTableResponse da ne bih pravili kopije
	err := GetJson(client, baseURL, &genresTableResponse)
	if err != nil {
		return fmt.Errorf("error getting genres: %s", err.Error())
	}

	// Print the genres and update the counter
	// Idemo kroz genresTableResponse.Results uzimamo element po element i izvrsavamo ovo sto je u funkciji
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

// preuzimamo platforms iz rawgApi i ubacujemo ih u bazu
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

// preuzimamo stors iz rawgApi i ubacujemo ih u bazu
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

// preuzimamo description iz rawgApi
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

	//dejlarisemo promenljivu gameDetails koja je mapa(dictionary) gde su kljucevi tima string a vrednosti bilo kog tipa
	var gameDetails map[string]interface{}
	//dekodiramo json response od api i ubacujemo ga u promenljivu gameDetailsj (ima ispred pokazivac da ne bih pravili bespotrebnu kopiju)
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
		//%s je placeholder koji ce biti zamenjen sa promenljivom baseURL
		//%d je placeholder koji ce biti zamenjen sa promenljivom page
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

// Vraca nam true ili fals u zavisnosti da li je broj dokumenata u bazi manji od zadatog
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
// Ovo je api endpoint koji cu da koristim u frontu (prepoznajem po tome sto koristim gin)
func GetPaginatedGames(c *gin.Context) {
	//konekcija za bazom
	ctx := context.TODO()
	quickstartDatabase := mongoClient.Database("GameStore")
	gamesCollection := quickstartDatabase.Collection("Games")

	// Parse query parameters for pagination and search
	//strconv.Atoi konbertuje page koji je string u number
	page, err := strconv.Atoi(c.Query("page"))
	//ako ne postoji ili je manji od 1 postavi da bude 1
	if err != nil || page < 1 {
		page = 1
	}

	pageSize, err := strconv.Atoi(c.Query("pageSize"))
	if err != nil || pageSize < 1 {
		pageSize = 10 // Default page size
	}

	//ovo su sve query (filteri)
	searchQuery := c.Query("search")
	platformQuery := c.Query("platform")
	storeQuery := c.Query("store")
	genreQuery := c.Query("genre")
	ratingQuery := c.Query("rating")
	ageQuery := c.Query("age")
	fmt.Println("Age: ", ageQuery)
	// Build the filter based on pagination and search criteria
	// Prvo definisemo prazan filter koji je map(dictionary)
	filter := bson.M{}
	//Proveravamo ako searchQuery nije prazan onda
	if searchQuery != "" {
		//Dodajemo kriteriju pretrage u filter
		// Koristi se bson.M{} za definisanje podfiltera, gdje ključ je ime polja (u ovom slučaju "name"), a vrijednost je mapa koja sadrži kriterijume pretrage za to polje.
		//postavljamo regex na searchQuery i dajemo opciju da pretraga nije case-sensitive
		filter["name"] = bson.M{"$regex": searchQuery, "$options": "i"}
	}
	if platformQuery != "" {
		platformID, err := strconv.Atoi(platformQuery) //pretvaramo u number
		if err != nil {
			//c.JSON je slanje json odgovora klijentu
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error querying platform filter"})
		}
		//u suprotnom dodajemo jos jedan podfilter
		filter["platforms.platform.id"] = platformID
	}
	if storeQuery != "" {
		storeID, err := strconv.Atoi(storeQuery)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error querying store filter"})
		}
		//stores.store.id ovako pisemo jer u nasem modelu za igrice Stores se odnosi na listu StoreWraper a svaki element u listi se odnosi na Store koji ima id i name
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
		//gte - veci ili jednak lt-manji od
		//Vrati sve igrice koje se nalaze u ovom opsegu ako je ratingID=3 vrati sve igrice izmednju 3 i 4
		filter["rating"] = bson.M{"$gte": ratingID, "$lt": ratingID + 1}
	}
	if ageQuery != "" {
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error querying AgeRating filter"})
		}
		//vrati igrice koje sadrze ageQuery
		filter["esrb_rating.name"] = bson.M{"$regex": ageQuery}
	}
	// Create a sorting option based on the query parameters
	// bson.M koristi mapu, dok bson.D koristi niz uredjenih elemenata
	//inicijalizujemo praznu mapu
	sortOptions := bson.D{}

	//uzimamo parametre iz upita
	sortQuery := c.Query("sort")
	signQuery := c.Query("sign")
	fmt.Println("Znak: ", signQuery)
	// Sort by name if requested
	if sortQuery != "" {
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error sorting name filter"})
		}
		if signQuery == "1" {
			//sortiramo uzlazno
			//bson.E je tip koji predstavlja pojedinacan element u BSON dokumentu
			sortOptions = append(sortOptions, bson.E{Key: strings.ToLower(sortQuery), Value: 1})
		} else {
			//sortiramo silazno
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
	//offset je broj rezultat koji cemo da preskocimo, sto vise stranica prolazimo to vise preskacemo
	offset := (page - 1) * pageSize
	limit := pageSize //broj rezultata po stranici

	// Query games from the collection with pagination and search filter
	//Izvršava se upit nad kolekcijom igara koristeći definirani filter, opcije za preskakanje, limitiranje i sortiranje rezultata. cursor je rezultat
	cursor, err := gamesCollection.Find(ctx, filter, options.Find().SetSkip(int64(offset)).SetLimit(int64(limit)).SetSort(sortOptions))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error querying paginated games from the database"})
		return
	}
	defer cursor.Close(ctx)

	// Iterate through the cursor and store games in a slice
	var games []bson.M //prazna lista za igre koje dobijamo iz upita
	//Ovdje se iterira kroz cursor i rezultati se pohranjuju u listu igara. U slučaju greške tijekom iteracije, program će zabilježiti grešku i prekinuti izvršavanje.
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

	//preuzimamo sve genres
	cursor, err := gamesCollection.Find(ctx, bson.M{})
	if err != nil {
		log.Fatal(err)
	}

	//inicijalizujemo praznu listu gde cemo da stavimo dobijene rezultate
	var genres []bson.M
	//.All se koristi za itiriranje kroz sve dokumente vraceni upitom pomocu cursor objekta &genres ovde ce da stavlja itirirane elemente koje dobijamo
	if err = cursor.All(ctx, &genres); err != nil {
		log.Fatal(err)
	}
	//ovde dajemo korisniku rezultat
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
	//Param se nalazi u URL a Query se nalazi u http body
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
	//Metoda Decode() koristi se za pretvaranje BSON (Binary JSON) dokumenta koji je vraćen iz MongoDB upita u odgovarajuću Go strukturu podataka.
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

// Add Games to user
func AddGamesToUser(c *gin.Context) {
	ctx := context.TODO()
	quickstartDatabase := mongoClient.Database("GameStore")
	userCollection := quickstartDatabase.Collection("Users")
	gamesCollection := quickstartDatabase.Collection("Games")

	var user moduls.User
	var games moduls.Game

	userEmail := c.Param("email")
	gameID := c.Param("game_id")

	fmt.Println("gameID: ", userEmail)
	fmt.Println("gameID: ", gameID)
	// Convert the gameID to an integer
	id, err := strconv.Atoi(gameID)
	fmt.Println("id: ", id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid game ID"})
		return
	}
	err = gamesCollection.FindOne(ctx, bson.M{"id": id}).Decode(&games)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Igra nije pronađen"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Greška pri upitu bazi podataka"})
		}
		return
	}

	err = userCollection.FindOne(ctx, bson.M{"email": userEmail}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Korisnik nije pronađen"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Greška pri upitu bazi podataka"})
		}
		return
	}

	// Dodavanje igre u listu igara korisnika
	user.Games = append(user.Games, games)

	// Ažuriranje korisnika u bazi podataka
	_, err = userCollection.UpdateOne(ctx, bson.M{"email": userEmail}, bson.M{"$set": user})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Greška pri ažuriranju korisnika"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Igra uspješno dodana korisniku"})
}

func Login(c *gin.Context) {
	ctx := context.TODO()
	quickstartDatabase := mongoClient.Database("GameStore")
	userCollection := quickstartDatabase.Collection("Users")

	var user moduls.User
	var email = c.Query("email")
	var pass = c.Query("password")

	if email == "" || pass == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Sva polja moraju biti popunjena"})
		return
	}

	var err = userCollection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Korisnik nije pronađen"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Greška pri upitu bazi podataka"})
		}
		return
	}

	err = bcrypt.CompareHashAndPassword(user.Password, []byte(pass))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Lozinka se ne poklapa"})
		return
	}

	tokenString, err := createToken(user.FirstName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Korisničko ime nije pronađeno"})
		return
	}

	SetCookie(c, "jwt", tokenString, time.Now().Add(time.Hour*1))
	c.JSON(http.StatusOK, gin.H{"user": user, "token": tokenString})
}

func Logout(c *gin.Context) {
	ClearCookie(c, "jwt")
}

func Register(c *gin.Context) {

	ctx := context.TODO()
	quickstartDatabase := mongoClient.Database("GameStore")
	userCollection := quickstartDatabase.Collection("Users")

	var user moduls.User
	var firstName = c.Query("firstName")
	var lastName = c.Query("lastName")
	var email = c.Query("email")
	var password = c.Query("password")
	var passwordConfirmation = c.Query("passwordConfirmation")

	if firstName == "" || lastName == "" || email == "" || password == "" || passwordConfirmation == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Sva polja moraju biti popunjena"})
		return
	}

	err := userCollection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {

			isValidEmail := govalidator.IsEmail(email)
			if !isValidEmail {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Neispravan email"})
				return
			}

		} else {
			// Some other error occurred while querying the database
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Greška prilikom pretrage korisnika"})
			return
		}
	} else {
		// User with this email already exists
		c.JSON(http.StatusConflict, gin.H{"error": "Korisnik već postoji"})
		return
	}

	if !isStrongPassword(password) {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Sifra nije dovoljno jaka"})
		return
	}

	// Hashing the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Greška prilikom heširanja lozinke"})
		return
	}

	// Comparing the hashed password with the input password
	err = bcrypt.CompareHashAndPassword(hashedPassword, []byte(passwordConfirmation))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Sifra se ne podudara"})
		return
	}

	tokenString, err := createToken(firstName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No username found"})
		return
	}

	SetCookie(c, "jwt", tokenString, time.Now().Add(time.Hour*1))

	user.FirstName = firstName
	user.LastName = lastName
	user.Email = email
	user.Password = hashedPassword

	InsertIntoMongoDBUsers(user)
	c.JSON(http.StatusOK, gin.H{"user": user, "token": tokenString})
}

func isStrongPassword(password string) bool {
	// Provera dužine šifre
	if len(password) < 8 {
		return false
	}

	// Provera prisustva velikih slova, malih slova, brojeva i specijalnih karaktera
	hasUpperCase := false
	hasLowerCase := false
	hasDigit := false
	hasSpecialChar := false

	for _, char := range password {
		switch {
		//Prolazi kroz celu abecedu i proverava da li je bar jedan karakter veliko slovo
		case 'A' <= char && char <= 'Z':
			hasUpperCase = true
			//Prolazi kroz celu abecedu i proverava da li je bar jedan karakter malo slovo
		case 'a' <= char && char <= 'z':
			hasLowerCase = true
			//Proverava da li se broj nalazi u sifri
		case '0' <= char && char <= '9':
			hasDigit = true
			//Proverava da li ima neki od ovih elemenata
		case regexp.MustCompile(`[!@#$%^&*(),.?":{}|<>]`).MatchString(string(char)):
			hasSpecialChar = true
		}
	}

	// Provera zadovoljenja svih kriterijuma
	return hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar
}

func createToken(username string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"username": username,
			"exp":      time.Now().Add(time.Hour).Unix(),
		})

	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func verifyToken(tokenString string) error {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})

	if err != nil {
		return err
	}

	if !token.Valid {
		return fmt.Errorf("invalid token")
	}

	return nil
}

func SetCookie(c *gin.Context, name string, value string, expiration time.Time) {
	cookie := buildCookie(name, value, expiration.Second())
	fmt.Println(cookie)
	http.SetCookie(c.Writer, cookie)
}

func ClearCookie(c *gin.Context, name string) {
	cookie := buildCookie(name, "", -1)

	http.SetCookie(c.Writer, cookie)
}

func buildCookie(name string, value string, expires int) *http.Cookie {
	cookie := &http.Cookie{
		Name:     name,
		Value:    value,
		Path:     "/",
		HttpOnly: true,
		MaxAge:   expires,
	}

	return cookie
}

func main() {
	router := gin.Default()
	// Configure CORS middlewar
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"https://api.rawg.io", "http://localhost:5173", "http://localhost:3000"} // Add your frontend's origins
	config.AllowCredentials = true
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
	router.GET("/games/:id", GetGame)
	router.GET("/genres", GetGenres)
	router.GET("/platforms", GetPlatforms)
	router.GET("/stores", GetStores)
	router.POST("/register", Register)
	router.POST("/login", Login)
	router.POST("/logout", Logout)
	router.POST("/userUpdate/:email/:game_id", AddGamesToUser)
	router.Run(":8080")
}
