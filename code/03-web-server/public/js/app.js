console.log('Die Javascript-Datei auf der Client-Seite wird geladen');

const weatherForm = document.querySelector('form');
const inputSearch = document.querySelector('input');
const messageOne = document.getElementById('message-1');
const messageTwo = document.getElementById('message-2');

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const baseURL = '/wetter?adressbegriff=';
    const url = `${baseURL}${inputSearch.value}`;

    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then(data => {
            if(data.fehler) throw new Error(data.fehler);

            const {standort, vollstandige_beschreibung: breschreibung} = data;

            messageOne.classList.remove('error-message');
            messageOne.textContent = standort;
            messageTwo.textContent = breschreibung;
        })
        .catch(error => {
            messageOne.textContent = error;
            messageOne.classList.add('error-message');
            messageTwo.textContent = '';
            console.log(error);
        });
});
