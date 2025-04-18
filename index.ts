// 📌 Milestone 1
// Crea un type alias Person per rappresentare una persona generica.

// Il tipo deve includere le seguenti proprietà:

// id: numero identificativo, non modificabile
// name: nome completo, stringa non modificabile
// birth_year: anno di nascita, numero
// death_year: anno di morte, numero opzionale
// biography: breve biografia, stringa
// image: URL dell'immagine, stringa

type Person = {
    readonly id: number;
    readonly name: string;
    birth_year: number;
    death_year?: number;
    biography: string;
    image: string;
};

// 📌 Milestone 2
// Crea un type alias Actress che oltre a tutte le proprietà di Person, aggiunge le seguenti proprietà:
// most_famous_movies: una tuple di 3 stringhe
// awards: una stringa
// nationality: una stringa tra un insieme definito di valori.
// Le nazionalità accettate sono: American, British, Australian, Israeli-American, South African, French, Indian, Israeli, Spanish, South Korean, Chinese.

type Nationality = 'American' | 'British' | 'Australian' | 'Israeli-American' | 'South African' | 'French' | 'Indian' | 'Israeli' | 'Spanish' | 'South-Korean' | 'Chinese'

type Actress = Person & {
    most_famous_movies: [string, string, string],
    awards: string,
    nationality: Nationality,
}

// 📌 Milestone 3
// Crea una funzione getActress che, dato un id, effettua una chiamata a:
// GET https://boolean-spec-frontend.vercel.app/freetestapi/actresses/:id
// La funzione deve restituire l’oggetto Actress, se esiste, oppure null se non trovato.
// Utilizza un type guard chiamato isActress per assicurarti che la struttura del dato ricevuto sia corretta. fatto



// type guard :v 
function isActress(object: unknown): object is Actress {

    const validNationality = ['American', 'British', 'Australian', 'Israeli-American', 'South African', 'French', 'Indian', 'Israeli', 'Spanish', 'South-Korean', 'Chinese']

    return (
        typeof object === "object" && object !== null &&
        'id' in object && typeof object.id === 'number' &&
        'name' in object && typeof object.name === 'string' &&
        'birth_year' in object && typeof object.birth_year === 'number' &&
        'death_year' in object && (typeof object.death_year === 'number' || typeof object.death_year === 'undefined') &&
        'biography' in object && typeof object.biography === 'string' &&
        'image' in object && typeof object.image === 'string' &&
        'most_famous_movies' in object &&
        object.most_famous_movies instanceof Array &&
        object.most_famous_movies.length === 3 &&
        object.most_famous_movies.every(el => typeof el === 'string') &&
        'awards' in object && typeof object.awards === 'string' &&
        'nationality' in object && typeof object.nationality === 'string' &&
        validNationality.includes(object.nationality)
    )
}

async function getActress(id: number): Promise<Actress | null> {
    try {
        const response = await fetch(`https://boolean-spec-frontend.vercel.app/freetestapi/actresses/${id}`);
        const data: unknown = await response.json()
        if (!isActress(data)) {
            throw new Error('Data non e un oggetto')
        }
        return data

    } catch (error) {
        if (error instanceof Error) {
            console.log('Errore durante la chiamata', error)
        } else {
            console.log(error)
        }
        return null
    }
}

// 📌 Milestone 4
// Crea una funzione getAllActresses che chiama:

// GET https://boolean-spec-frontend.vercel.app/freetestapi/actresses
// La funzione deve restituire un array di oggetti Actress.

// Può essere anche un array vuoto.

async function getAllActresses(): Promise<Actress[]> {
    try {

        const response = await fetch(`https://boolean-spec-frontend.vercel.app/freetestapi/actresses`);
        const data: unknown = await response.json();

        if (!(data instanceof Array)) {
            throw new Error('il oggetto non e un array')
        }

        const onlyValidActressObject: Actress[] = data.filter(isActress)
        return onlyValidActressObject


    } catch (error) {
        if (error instanceof Error) {
            console.log(`Errore durante la chiamata`, error)
        } else {
            console.log(error)
        }
        return []
    }
}

// 📌 Milestone 5
// Crea una funzione getActresses che riceve un array di numeri (gli id delle attrici).
// Per ogni id nell’array, usa la funzione getActress che hai creato nella Milestone 3 per recuperare l’attrice corrispondente.
// L'obiettivo è ottenere una lista di risultati in parallelo, quindi dovrai usare Promise.all.
// La funzione deve restituire un array contenente elementi di tipo Actress oppure null (se l’attrice non è stata trovata).

async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
    try {

        const promises = ids.map(id => getActress(id))
        const Actresses = await Promise.all(promises);
        return Actresses

    }
    catch (error) {
        if (error instanceof Error) {
            console.log(`Errore durante la chiamata`, error)
        } else {
            console.log(error)
        }
        return []

    }
}
