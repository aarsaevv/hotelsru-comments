import './scss/app.scss'
import { addElementToPage, getTime, customDateWithCurrentTime, serialize, deserialize } from './helpers'


// INTRO

/** Я решил использовать localStorage (далее LS) как псевдо-сервер. Вместо того,
 * чтобы лишь кэшировать отправленные сообщения и сохранять их после обновления страницы, я эмулирую запрос к серверу
 * каждый раз при загрузке страницы, следовательно, при изменении входных данных изменяется и отображение. Соответственно,
 * при отправке комментария он сначала изменяет данные на псевдо-сервере, а затем отображение.
 */


// DATA AND ACTIONS WITH DATA

/** Вот и псевдо-данные из БД.
 * Если массив будет пустым или null, будет 0 сообщений.
*/
let commentsArray = [
    {
        id: 1677853903000,
        name: 'cветлана',
        text: 'Я, конечно, понимаю, что вам надо деньги зарабатывать, но нельзя же писать про шампуни!',
        stamp: 1677853903000,
        likedBy: ['Skyler White', 'Saul Goodman', 'Jessie'],
    },
    {
        id: 1678190743000,
        name: 'Игорь',
        text: 'А что такого? Нормальный шампунь. Моя собака не жаловалась.',
        stamp: 1678190743000, 
        likedBy: ['Mike Ermantraut', 'Heisenberg', 'Tuco', 'Gus Fring'],
    },
    {
        id: 1678255543000,
        name: 'cветлана',
        text: 'Не знаю, юмор это или нет, мне всё равно! Так впаривать эту дрянь - возмутительно!',
        stamp: 1678255543000,
        likedBy: ['Skyler White', 'Hector'],
    },
    {
        id: 1678377943000,
        name: 'raygan228',
        text: 'Кто-то тратит деньги на рекламу, а кого-то клиенты находят сами.',
        stamp: 1678377943000,
        likedBy: ['Hank Schrader'],
    },
]

/** Добавляем комментарии в LS из массива комментариев. */
function setCommentsToLocalStorage(commentsArray) {

    /** Если с массивом все в порядке, добавляем в LS */
    if(commentsArray && commentsArray.length) {
        let comments = serialize(commentsArray)
        localStorage.setItem('comments', comments)
    }

    /** LS очищается для "похожести" на 404 */
    else localStorage.clear()
}

/** Забираем комментарии */
function getCommentsFromLocalStorage() {

    hideLoadingMessage()

    /** Если получили, вызываем функции для добавления элементов на страницу */
    if(localStorage.getItem('comments')) {

        let parsedComments = deserialize(localStorage.getItem('comments'))
        appendCommentsFromLocalStorage(parsedComments)
    }
}

/** Функция добавления элемента в массив для дальнейшего помещения его в LS. */
function addCommentToLocalStorage(parsedComments, formName, formText, formDate) {
    let choosedDateWithCurrentTime = customDateWithCurrentTime(formDate)

    parsedComments.push({
        id: formDate.value ? choosedDateWithCurrentTime : Date.now(),
        name: formName.value,
        text: formText.value,
        stamp: formDate.value ? choosedDateWithCurrentTime : Date.now(),
        likedBy: [],
    })
}

// /** Функция "лайкания" элемента в LS */
// function likeCommentToLocalStorage(id) {

// }


/** Функция удаления элемента списка из LS */
function removeCommentFromLocalStorage(id) {

    let parsedComments = deserialize(localStorage.getItem('comments'))

    parsedComments = parsedComments.filter(el => el.id !== id)
    localStorage.setItem('comments', serialize(parsedComments))
}


// HANDLERS
//*** ПЕРЕПИСАТЬ, ЧТОБЫ ВИСЕЛО НА ДОБАВЛЕННЫХ ЭЛЕМЕНТАХ

/** Обработчик клика на корзину  */
function handleRemovingComment() {

    let listItem = document.querySelectorAll('.list__item')
    let deleteButtons = document.querySelectorAll('.buttons__delete')

    deleteButtons.forEach(deleteButton => {
        deleteButton.addEventListener('click', () => {

            listItem.forEach(listItem => {
                listItem.addEventListener('click', () => {
                    /** Удаляем элемент списка из разметки. */
                    listItem.remove()
                })
            })
            /** Удаление элемента списка из LS */
            removeCommentFromLocalStorage(deleteButton.commentId)
        })
    })
}

/** Обработчик добавления элемента через форму. */
function handleSubmitComment() {

    let submitButton = document.querySelector('.form__submit')

    let formName = document.querySelector('.form__name')
    let formText = document.querySelector('.form__text')
    let formDate = document.querySelector('.form__date')

    /** Слушатели на поля имени, текстового контента и даты */
    formName.addEventListener('keydown', (e) => {

        if(e.key === 'Enter') {

            e.preventDefault()
            if(formName.value.length < 4) throw('Введите имя длиной не менее 4 символов.')
            if(formText.value.length < 4) throw('Введите текст длиной не менее 4 символов.')

            submitComment(formName, formText, formDate)
        }
    })

    formText.addEventListener('keydown', (e) => {

        if(e.key === 'Enter') {

            e.preventDefault()
            if(formName.value.length < 4) throw('Введите имя длиной не менее 4 символов.')
            if(formText.value.length < 4) throw('Введите текст длиной не менее 4 символов.')
        
            submitComment(formName, formText, formDate)
        }
    })

    formDate.addEventListener('keydown', (e) => {

        if(e.key === 'Enter') {

            if(!formName.value) throw('Нет имени')
            if(!formText.value) throw('Нет текста')
        
            submitComment(formName, formText, formDate)
        }
    })

    /** Слушатель на кнопку */
    submitButton.addEventListener('click', () => {

        if(!formName.value) throw('Нет имени')
        if(!formText.value) throw('Нет текста')
        
        submitComment(formName, formText, formDate)
    })   
}

// /** Обработчик клика на сердечко */
// function handleLike() {

// }


// APPENDERS TO HTML
//*** СДЕЛАТЬ ЛАЙК

/** Отрисовываем комментарии в списке */
function appendCommentsFromLocalStorage(parsedComments) {

    for(let item of parsedComments) {

        let li = document.createElement('li')
        li.commentId = item.stamp
        addElementToPage(li, 'list__item')(ul, li)


        let name = document.createElement('div')
        addElementToPage(name, 'item__name', item.name)(li, name)

        let text = document.createElement('div')
        addElementToPage(text, 'item__text', item.text)(li, text)

        let info = document.createElement('div')
        addElementToPage(info, 'item__info')(li, info)


        let infoDate = document.createElement('div')
        addElementToPage(infoDate, 'info__date', `${getTime(item.stamp)}`)(info, infoDate)

        let infoButtons = document.createElement('div')
        addElementToPage(infoButtons, 'info__buttons')(info, infoButtons)


        let buttonLike = document.createElement('button')
        buttonLike.commentId = item.stamp
        addElementToPage(buttonLike, 'buttons__like')(infoButtons, buttonLike)

        let likesCount = document.createElement('span')
        addElementToPage(likesCount, 'info__likes', item.likedBy.length)(infoButtons, likesCount)
        
        let buttonDelete = document.createElement('button')
        buttonDelete.commentId = item.stamp
        addElementToPage(buttonDelete, 'buttons__delete')(infoButtons, buttonDelete)
    }
}

/** Функция добавления элемента в разметку. Вызывает функцию добавления элемента в LS. */
function submitComment(formName, formText, formDate) {


    let li = document.createElement('li')
    addElementToPage(li, 'list__item')(ul, li)

    
    let name = document.createElement('div')
    addElementToPage(name, 'item__name', formName.value)(li, name)

    let text = document.createElement('div')
    addElementToPage(text, 'item__text', formText.value)(li, text)

    let info = document.createElement('div')
    addElementToPage(info, 'item__info')(li, info)


    /** Если дата выбрана, возвращает ее в формате: выбранная дата + текущее время.
     * В противном случае возвращает текущие дату и время.
     */
    let infoDate = document.createElement('div')
    addElementToPage(infoDate, 'info__date', formDate.valueAsNumber 
        ? getTime(customDateWithCurrentTime(formDate)) 
        : getTime(Date.now()))(info, infoDate)

    let infoButtons = document.createElement('div')
    addElementToPage(infoButtons, 'info__buttons')(info, infoButtons)


    let buttonLike = document.createElement('button')
    addElementToPage(buttonLike, 'buttons__like')(infoButtons, buttonLike)

    let likesCount = document.createElement('span')
    addElementToPage(likesCount, 'info__likes', 0)(infoButtons, likesCount)
    
    let buttonDelete = document.createElement('button')
    addElementToPage(buttonDelete, 'buttons__delete')(infoButtons, buttonDelete)
    

    /** Действия в зависимости от того, есть запись в LS на данный момент или нет. */
    if(localStorage.getItem('comments')) {

        let parsedComments = deserialize(localStorage.getItem('comments'))
        addCommentToLocalStorage(parsedComments, formName, formText, formDate)
        localStorage.setItem('comments', serialize(parsedComments))

    } else {
        localStorage.setItem('comments', `[]`)

        let parsedComments = deserialize(localStorage.getItem('comments'))
        addCommentToLocalStorage(parsedComments, formName, formText, formDate)
        localStorage.setItem('comments', serialize(parsedComments))
    }
}

// function likeComment(id) {
// }


// NOTIFICATIONS
//*** СДЕЛАТЬ ВАЛИДАЦИЮ

/** Заглушка загрузки */
function showLoadingMessage() {

    let loadingMessage = document.createElement('h1')
    
    addElementToPage(loadingMessage, 'comments__loading', 'Загрузка комментариев...')(ul, loadingMessage)
}

/** Скрытие заглушки загрузки */
function hideLoadingMessage() {

    let loadingMessage = document.querySelector('.comments__loading')
    loadingMessage.remove()
}


// STARTUP

let ul = document.querySelector('.comments__list')

/** Вызов заглушки */
showLoadingMessage()

/** Небольшая задержка для реалистичности */
setTimeout(() => {
    setCommentsToLocalStorage(commentsArray)
}, 300)

setTimeout(() => {
    getCommentsFromLocalStorage()
    handleSubmitComment()
    handleRemovingComment()
    // handleLike()
}, 600)

/** Меняем массив через LS в целях реализации взаимодействия данных и LS */
if(localStorage.getItem('comments')) {

    let parsedComments = deserialize(localStorage.getItem('comments'))
    commentsArray = parsedComments
}
else {
    commentsArray = []
}