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
        id: 0,
        name: 'cветлана',
        text: 'Я, конечно, понимаю, что вам надо деньги зарабатывать, но нельзя же писать про шампуни!',
        stamp: 1678183657000,
        likedBy: ['Skyler White', 'Saul Goodman', 'Jessie'],
    },
    {
        id: 1,
        name: 'Игорь',
        text: 'А что такого? Нормальный шампунь. Моя собака не жаловалась.',
        stamp: 1678270057000,
        likedBy: ['Mike Ermantraut', 'Heisenberg', 'Tuco', 'Gus Fring'],
    },
    {
        id: 2,
        name: 'cветлана',
        text: 'Не знаю, юмор это или нет, мне всё равно! Так впаривать эту дрянь - возмутительно!',
        stamp: 1678288057000,
        likedBy: ['Skyler White', 'Hector'],
    },
    {
        id: 3,
        name: 'raygan228',
        text: 'Кто-то тратит деньги на рекламу, а кого-то клиенты находят сами.',
        stamp: 1678356589000,
        likedBy: ['Hank Schrader'],
    },
]

// commentsArray = null

/** Меняем массив через LS. */
if(localStorage.getItem('comments')) {
    let parsedComments = JSON.parse(localStorage.getItem('comments'))
    commentsArray = parsedComments
    console.log(parsedComments, commentsArray)
} else commentsArray = []

/** Добавляем комментарии */
function setCommentsToLocalStorage(commentsArray) {
    /** Если с массивом все в порядке, добавляем в LS */
    if(commentsArray && commentsArray.length) {
        let comments = JSON.stringify(commentsArray)
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
        let parsedComments = JSON.parse(localStorage.getItem('comments'))
        appendCommentsCount(parsedComments)
        appendComments(parsedComments)

    /** В противном случае генерируем сообщение "Нет комментариев..." */
    } else {
        showNoCommentsMessage()
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
        buttonDelete.commentId = item.id
        addElementToPage(buttonDelete, 'buttons__delete')(infoButtons, buttonDelete)
    }
}

/** Сообщение, если комментариев нет */
function showNoCommentsMessage() {
    let ul = document.querySelector('.comments__list')
    let errorMessage = document.createElement('h1')
    addElementToPage(errorMessage, 'comments__error', 'Нет комментариев. Будьте первым, кто оставит комментарий.')(ul, errorMessage)
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

// function toggleLike() {
// }

// function submitComment() {
// }

/** Небольшая задержка для реалистичности */
setTimeout(() => setCommentsToLocalStorage(commentsArray), 300)
setTimeout(() => {

    getCommentsFromLocalStorage()
    handleRemovingComment()
    handleSubmitComment()
    console.log(commentsArray)    

}, 600)

/** И заглушка */
showLoadingMessage()

/** Заметки на полях:
 * 1. Написать хэлпер для создания форм -- готово
 * 2. Сделать отправку и удаление
 * 3. Сделать отображение лайков и лайк/дизлайк
 * 4. Сделать таймстамп и вчера/сегодня - возвращает строку -- готово
 */
function handleRemovingComment() {
    let deleteButton = document.querySelectorAll('.buttons__delete')
    deleteButton.forEach(deleteButton => {
        deleteButton.addEventListener('click', () => removeComment(deleteButton.commentId))
    })
}

function removeComment(id) {
    let parsedComments = JSON.parse(localStorage.getItem('comments'))
    parsedComments = parsedComments.filter(el => el.id !== id)
    localStorage.setItem('comments', JSON.stringify(parsedComments))
    window.location.reload()
}

function handleSubmitComment() {
    let submitButton = document.querySelector('.form__submit')
    submitButton.addEventListener('click', () => submitComment(commentsArray))
}

function submitComment() {
    if(localStorage.getItem('comments')) {
        let parsedComments = JSON.parse(localStorage.getItem('comments'))
        parsedComments.push({
            id: commentsArray.length + 1,
            name: 'Евгений',
            text: 'Работает!',
            stamp: Date.now(),
            likedBy: ['Skyler White', 'Saul Goodman', 'Jessie'],
        })
        localStorage.setItem('comments', JSON.stringify(parsedComments))
        window.location.reload()
    } else {
        localStorage.setItem('comments', `[]`)
        let parsedComments = JSON.parse(localStorage.getItem('comments'))
        console.log(parsedComments)
        parsedComments.push({
            id: commentsArray.length + 1,
            name: 'Евгений',
            text: 'Работает!',
            stamp: Date.now(),
            likedBy: ['Skyler White', 'Saul Goodman', 'Jessie'],
        })
        localStorage.setItem('comments', JSON.stringify(parsedComments))
        window.location.reload()
    }   
}