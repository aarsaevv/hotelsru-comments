import './scss/app.scss'

/** Я решил использовать localStorage (далее LS) как псевдо-сервер. Вместо того,
 * чтобы лишь кэшировать отправленные сообщения и сохранять их после обновления страницы, я эмулирую запрос к серверу
 * каждый раз при загрузке страницы, следовательно, при изменении входных данных изменяется и отображение. Соответственно,
 * при отправке комментария он сначала изменяет данные на псевдо-сервере, а затем отображение.
 */

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

/** Меняем массив через LS в целях реализации взаимодействия данных и LS */
if(localStorage.getItem('comments')) {
    let parsedComments = deserialize(localStorage.getItem('comments'))
    commentsArray = parsedComments
} else {
    commentsArray = []
}

/** Добавляем комментарии */
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
        appendCommentsCount(parsedComments)
        appendComments(parsedComments)
    }
}

/** Функция, которая прибавляет количество комментариев к строке "Комментарии" */
function appendCommentsCount(parsedComments) {
    let header = document.querySelector('.list__header')
    header.textContent = 'Комментарии' + ' [' + parsedComments.length + ']'
}

/** Отрисовываем комментарии со всей информацией в списке */
function appendComments(parsedComments) {
    let ul = document.querySelector('.comments__list')

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
        addElementToPage(buttonLike, 'buttons__like')(infoButtons, buttonLike)

        let likesCount = document.createElement('span')
        addElementToPage(likesCount, 'info__likes', item.likedBy.length)(infoButtons, likesCount)
        
        let buttonDelete = document.createElement('button')
        buttonDelete.commentId = item.stamp
        addElementToPage(buttonDelete, 'buttons__delete')(infoButtons, buttonDelete)
    }
}

/** Заглушка загрузки */
function showLoadingMessage() {
    let ul = document.querySelector('.comments__list')
    let loadingMessage = document.createElement('h1')
    loadingMessage.classList.add('comments__loading')
    loadingMessage.textContent = 'Загрузка комментариев...'
    ul.append(loadingMessage)
}

/** Скрытие заглушки загрузки */
function hideLoadingMessage() {
    let loadingMessage = document.querySelector('.comments__loading')
    loadingMessage.remove()
}

/** Функция-хэлпер для унифицированного добавления элементов в DOM-дерево.
 * Настраивает свойства элемента, затем добавляет его в выбранную ноду.
 * 
 * Параметры элемента:
 * 1. Имя созданного элемента
 * 2. Название класса: String
 * 3. Текстовый контент: String
 * 4. Родительская нода
 * 5. Дочерняя нода
 */
function addElementToPage(tagVariable, className, textContent = '') {
    tagVariable.classList.add(className)
    tagVariable.textContent = textContent

    return function appendElement(parentNode, childNode) {
        parentNode.append(childNode)
    }
}

function handleRemovingComment() {
    let listItem = document.querySelectorAll('.list__item')
    let deleteButton = document.querySelectorAll('.buttons__delete')

    deleteButton.forEach(deleteButton => {
        deleteButton.addEventListener('click', () => {
            listItem.forEach(listItem => {
                listItem.addEventListener('click', () => {
                    listItem.remove()
                })
            })
            removeComment(deleteButton.commentId)
        })
    })
}

function removeComment(id) {
    let parsedComments = deserialize(localStorage.getItem('comments'))
    parsedComments = parsedComments.filter(el => el.id !== id)
    localStorage.setItem('comments', serialize(parsedComments))
}

function handleSubmitComment() {
    let submitButton = document.querySelector('.form__submit')

    let formName = document.querySelector('.form__name')
    let formText = document.querySelector('.form__text')
    let formDate = document.querySelector('.form__date')

    formName.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            e.preventDefault()
            if(!formName.value) throw('Нет имени')
            if(!formText.value) throw('Нет текста')

            submitComment(commentsArray, formName, formText, formDate)
        }
    })

    formText.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            e.preventDefault()
            if(!formName.value) throw('Нет имени')
            if(!formText.value) throw('Нет текста')
        
            submitComment(commentsArray, formName, formText, formDate)
        }
    })

    formDate.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            if(!formName.value) throw('Нет имени')
            if(!formText.value) throw('Нет текста')
        
            submitComment(commentsArray, formName, formText, formDate)
        }
    })

    submitButton.addEventListener('click', () => {
        if(!formName.value) throw('Нет имени')
        if(!formText.value) throw('Нет текста')
        
        submitComment(commentsArray, formName, formText, formDate)
    })   
}

function submitComment(commentsArray, formName, formText, formDate) {

    let ul = document.querySelector('.comments__list')

    let li = document.createElement('li')
    addElementToPage(li, 'list__item')(ul, li)

    
    let name = document.createElement('div')
    addElementToPage(name, 'item__name', formName.value)(li, name)

    let text = document.createElement('div')
    addElementToPage(text, 'item__text', formText.value)(li, text)

    let info = document.createElement('div')
    addElementToPage(info, 'item__info')(li, info)


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
    
    if(localStorage.getItem('comments')) {
        let parsedComments = deserialize(localStorage.getItem('comments'))
        addCommentToLocalStorage(parsedComments, formName, formText, formDate)
        localStorage.setItem('comments', serialize(parsedComments))

        appendCommentsCount(parsedComments)
    } else {
        localStorage.setItem('comments', `[]`)
        let parsedComments = deserialize(localStorage.getItem('comments'))
        addCommentToLocalStorage(parsedComments, formName, formText, formDate)
        localStorage.setItem('comments', serialize(parsedComments))

        appendCommentsCount(parsedComments)
    }
}

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

/** Десериализатор */
function deserialize(entry) {
    return JSON.parse(entry)
}

/** Сериализатор */
function serialize(entry) {
    return JSON.stringify(entry)
}

/** Функция проверки и отображения таймстампа в человеческом формате. Если пост написан сегодня или вчера, отображает это и время.
 * Если пост написан давно, отображает дату и время.
 */
function getTime(stamp) {
    let date = new Date(stamp)
    let singleDay = 86400000
    let twoDays = 172800000

    return ((Date.now() - stamp) < singleDay)
        ? 'Сегодня, ' + date.toLocaleTimeString(['ru-RU'], {hour: '2-digit', minute: '2-digit'})
        : (((Date.now() - stamp) > singleDay) && ((Date.now() - stamp) < twoDays))
        ? 'Вчера, ' + date.toLocaleTimeString(['ru-RU'], {hour: '2-digit', minute: '2-digit'})
        : [date.toLocaleTimeString(['ru-RU'], {day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit'})]
}

/** Функция для отображения выбранной кастомной даты, но с текущим временем у пользователя. */
function customDateWithCurrentTime(formDate) {
    const ONE_HOUR_IN_MS = 3600000
    const ONE_MINUTE_IN_MS = 60000
    
    let date = new Date()
    
    let hoursInMs = date.getHours() * ONE_HOUR_IN_MS
    let minutesInMs = date.getMinutes() * ONE_MINUTE_IN_MS
    let timeAfterMidnight = hoursInMs + minutesInMs
    
    let choosedDateWithNoTime = formDate.valueAsNumber - (6 * ONE_HOUR_IN_MS)
    let choosedDateWithCurrentTime = choosedDateWithNoTime + timeAfterMidnight

    return choosedDateWithCurrentTime
}

/** Небольшая задержка для реалистичности */
setTimeout(() => {
    setCommentsToLocalStorage(commentsArray)
}, 300)
setTimeout(() => {

    getCommentsFromLocalStorage()
    handleSubmitComment()

}, 600)
setTimeout(() => {

    handleRemovingComment()

}, 900)

/** И заглушка */
showLoadingMessage()

/** Заметки на полях:
 * 1. Написать хэлпер для создания форм -- готово
 * 2. Сделать отправку и удаление -- готово
 * 4. Сделать таймстамп и вчера/сегодня - возвращает строку -- готово
 * 5. Сериализатор - десериализатор -- готово
 * 3. Сделать отображение лайков и лайк/дизлайк
 * 6. Рефакторинг
 * 7. Комментарии
 * 8. Преобразование даты и подхват времени -- готово
 * 9. Валидация
 * 10. Добавление -- готово/Удаление без обновления страницы
 */