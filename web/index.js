import datas from "./data.js";

document.addEventListener('DOMContentLoaded', () => {
    let Printword = document.querySelector('#word');
    let DEFword = document.querySelector('#definition');
    let TempText = document.querySelector('#temp_text');
    let input_letter_text = document.querySelector('#input_letter_text');
    let baraban_text = document.querySelector('#baraban_text');
    let input_letter_doc = document.querySelector('#input_letter');
    

    let reset_button = document.querySelector('.reset_button')
    let end__game_page = document.querySelector('.end__game');
    let Ressult__word = document.querySelector('#Result__word');
    let winner__text = document.querySelector('#winner__text');
    let all__score = document.querySelector('#all__score');


    let polayer = document.querySelector('#polayer');
    let pl__sc1 = document.querySelector('#pl__sc1');
    let pl__sc2 = document.querySelector('#pl__sc2');
    let pl__sc3 = document.querySelector('#pl__sc3');

    let pl__sc11 = document.querySelector('#pl__sc11');
    let pl__sc21 = document.querySelector('#pl__sc21');
    let pl__sc32 = document.querySelector('#pl__sc31');

    let baraban = [0,0,0,0,0,0,0,0,0,-1,100,120,140,160,180,200,220,240,260,280,300];

    let words = datas[1];
    let STBUT = document.querySelector('.start_button');
    let STPage = document.querySelector('.start_page');
    let GamePage = document.querySelector('.game_page');

    STBUT.addEventListener('click', () => {
        STPage.classList.toggle('close');
        GamePage.classList.toggle('active');
        game(words);
    });

    reset_button.addEventListener('click', ()=>{
        GamePage.classList.toggle('active');
        end__game_page.classList.remove('active');
        game(words);
    })

    let currentClickClosure;
    

    function game(words) {

    input_letter_doc.focus()

        let players = {
            'pl1': {
                'count': 0,
                'name': "игрок 1",
            },
            'pl2': {
                'count': 0,
                'name': "игрок 2",
            },
            'pl3': {
                'count': 0,
                'name': "игрок 3",
            },
        };

        let my_word = words[Math.ceil(Math.random() * (words.length - 1))];
        let word = my_word.split('#')[0].toUpperCase();
        let description = my_word.split('#')[1];
        let result = [];

        for (let i = 0; i < word.length; i++) {
            result[i] = '_';
        }

        DEFword.innerHTML = description;
        Printword.innerHTML = result.join(' ');

        let players_flag = 0;
        let entered_words = ['']
        
        setTimeout(()=>{
            Switch(players_flag, entered_words, players, result, word,true);
        },100) 
    }

    
    function Turn( players_flag, entered_words, players, baraban__value, result, word) {
        let input_letter = input_letter_doc.value.toUpperCase();
    
        input_letter_doc.value = '';
        if (baraban__value == 0) {
            try {
                if (input_letter.trim() === '' || isNaN(input_letter) || Number(input_letter) <= 0 || Number(input_letter) > result.length) {
                    TempText.innerHTML = "Invalid input, please enter a valid number";
                    setTimeout(() => {
                        TempText.innerHTML = '';
                    }, 1000);
                    return
                } else {
                    input_letter = word[Number(input_letter) - 1];
                }
            } catch {
                TempText.innerHTML = 'вы ввели неправильное число';
                setTimeout(() => {
                    TempText.innerHTML = '';
                }, 1000);
                return;
            }
        } else {
            if (entered_words.includes(input_letter)) {
    
                TempText.innerHTML = 'такая буква уже была , введите другую';
                setTimeout(() => {
                    TempText.innerHTML = ''
                }, 1000);
                return;
            } else {
                entered_words.push(input_letter)
            }
        }
    
        input_letter_doc.removeEventListener('keypress', currentClickClosure);
        setTimeout(() => {
            OpenLetters(input_letter, players, baraban__value, result, word, players_flag, entered_words);
        }, 50);
        return;
    }
    

    function OpenLetters(input_letter, players, baraban__value, result, word, players_flag,entered_words) {
        TempText.innerHTML = '';
        input_letter_doc.value = ''
        let game_flag = 0;

        for (let i = 0; i < result.length; i++) {
            if (input_letter === word[i].toUpperCase()) {
                result[i] = word[i].toUpperCase();
                game_flag += 1;
            }
        }

        if (baraban__value >= 100) {
            players[players_flag % 3 !== 0 ? ('pl' + players_flag % 3) : 'pl3']['count'] += game_flag * baraban__value;
        }
        let isChange = game_flag == 0
        baraban_text.innerHTML = ''
        setTimeout(() => {
            Switch(players_flag, entered_words, players, result, word,isChange);
        }, 50);
    }

    function CheckBaraban(players_flag, entered_words, players, result, word) {
        Printword.innerHTML = result.join(' ');

        let baraban__value = baraban[Math.ceil(Math.random() * (baraban.length - 1))];

        polayer.innerHTML = `ход игрока номер ${players_flag % 3 === 0 ? 3 : players_flag % 3}`;
        
        baraban_text.innerHTML = baraban__value == 0 || baraban__value == -1? 'сектор + на барабане , введите номер буквы' : `очков на барабане: ${baraban__value}`
        input_letter_text.innerHTML = '';
        
        if (baraban__value == -1) {
            baraban_text.innerHTML = "вы пропускаете ход";
            setTimeout(() => {
                baraban_text.innerHTML = "";
                Switch(players_flag, entered_words, players, result, word,false);
            }, 1000);
            return;
        }
        input_letter_doc.value = ''
        
            currentClickClosure = current_click(players_flag, entered_words, players, baraban__value, result, word);
            input_letter_doc.addEventListener('keypress', currentClickClosure);
    }
    function current_click( players_flag, entered_words, players, baraban__value, result, word) {
        return function clicked(e) {
            if (e.key == 'Enter') {
                Turn( players_flag, entered_words, players, baraban__value, result, word);
            }
        }
    }
    

    function Switch(players_flag, entered_words, players, result, word,isChange) {
        TempText.innerHTML = '';

        pl__sc1.innerHTML = `${players['pl1']['name']} : ${players['pl1']['count']}`
        pl__sc2.innerHTML = `${players['pl2']['name']} : ${players['pl2']['count']}`
        pl__sc3.innerHTML = `${players['pl3']['name']} : ${players['pl3']['count']}`

        checkWin(players, players_flag,entered_words, result, word,isChange);
    }

    function checkWin(players, players_flag, entered_words, result, word,isChange) {
        if (result.join('') == word) {
            end__game_page.classList.add('active');
            GamePage.classList.toggle('active');

            Ressult__word.innerHTML = `Загаданное слово: ${word}`;
            winner__text.innerHTML = `Победил игрок номер ${players_flag % 3 === 0 ? 3 : players_flag % 3}`;
            all__score.innerHTML = `  
                \n
            
                Количество очков:\n`
                pl__sc11.innerHTML = `${players['pl1']['name']} : ${players['pl1']['count']}`
                pl__sc21.innerHTML = `${players['pl2']['name']} : ${players['pl2']['count']}`
                pl__sc31.innerHTML = `${players['pl3']['name']} : ${players['pl3']['count']}`
        } else {
            if(isChange){
                players_flag += 1;
            }    
            setTimeout(() => {
                CheckBaraban(players_flag, entered_words, players, result, word);
            }, 50);
        }
    }
    
});
