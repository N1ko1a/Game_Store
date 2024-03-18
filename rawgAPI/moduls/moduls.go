package moduls

// Struktura podataka
type Game struct {
	Id              int               `json:"id" bson:"id"`
	Name            string            `json:"name" bson:"name"`
	BackgroundImage string            `json:"background_image" bson:"background_image"`
	Description     string            `json:"description" bson:"description"`
	Rating          float64           `json:"rating" bson:"rating"`
	Released        string            `json:"released" bson:"released"`
	AgeRating       *EsrbRating       `json:"esrb_rating" bson:"esrb_rating"`
	GamePlatforms   []PlatformWrapper `json:"platforms" bson:"platforms"`
	Stores          []StoreWrapper    `json:"stores" bson:"stores"`
	Genres          []Genre           `json:"genres" bson:"genres"`
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

type GenresTable struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}
type PlatformsTable struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}
type StoresTable struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type GenresTableResponse struct {
	Results []GenresTable `json:"results"` //bice niz igrica
}
type PlatformsTableResponse struct {
	Results []PlatformsTable `json:"results"` //bice niz igrica
}
type StoresTableResponse struct {
	Results []StoresTable `json:"results"` //bice niz igrica
}

type User struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Password  []byte `json:"password"`
	Games     []Game `json:"games"`
}
